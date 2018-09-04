from __future__ import absolute_import, unicode_literals
from datetime import datetime, timedelta
from celery import Celery
from celery.utils.log import get_task_logger
from celery.signals import celeryd_after_setup
from django.conf import settings
from mongoengine.queryset.visitor import Q
import requests

from unified.models import UnifiedWorkflow
from workflows.models import Prep, Site, Workflow, WorkflowToUpdate, Task, TaskSiteStatus

app = Celery('workflows')
logger = get_task_logger(__name__)


@celeryd_after_setup.connect
def setup_direct_queue(sender, instance, **kwargs):
    logger.info('Fetch workflows from Unified on startup')
    fetch_new_workflows_from_unified.delay()
    update_workflows_from_request_manager.delay()


@app.task(ignore_result=True)
def fetch_new_workflows_from_unified():
    logger.debug('Preparing to fetch workflows from Unified')

    unified_wfs = UnifiedWorkflow.objects \
        .filter(status__icontains='manual') \
        .values_list('name', flat=True)
    logger.info('Received unified workflows with status manual size {0}'.format(len(unified_wfs)))

    try:
        WorkflowToUpdate.objects.all().delete()

        wtc_wfs = WorkflowToUpdate.objects \
            .all() \
            .values_list('name')
        logger.debug('Received wtc-console workflows size {0}'.format(len(wtc_wfs)))

        new_wfs = list(set(unified_wfs) - set(wtc_wfs))
        logger.info('New workflows size {0}'.format(len(new_wfs)))

        for wf_name in new_wfs:
            WorkflowToUpdate(name=wf_name).save()
            logger.debug('Added new workflow {0}'.format(wf_name))

    except Exception as e:
        logger.error('Exception raised: {}'.format(e))


def parse_task_statuses(task_data):
    statuses = []

    for site_name, site_data in task_data['sites'].items():
        failures = site_data.get('failure', {'': 0}).values()
        failed_cnt = sum(map(int, failures))

        logger.debug(
            'Site {0}, success {1}, failures {2}'.format(site_name, site_data.get('success', 0),
                                                         failed_cnt))

        dataset_keys = site_data.get('dataset', {'': {}}).keys()
        dataset = list(dataset_keys)[0] if dataset_keys else ''

        # Remove this after implementing drain statuses retrieval
        site = Site(name=site_name)
        site.save()

        statuses.append(TaskSiteStatus(
            site=site_name,
            dataset=dataset,
            success_count=site_data.get('success', 0),
            failed_count=failed_cnt,
        ))

    return statuses


def update_workflow_tasks(prep, workflow, job_data):
    for task_name, task_data in job_data['tasks'].items():
        if 'sites' not in task_data:
            continue
        try:
            Task(
                name=task_name,
                job_type=task_data.get('jobtype'),
                updated=datetime.utcnow(),
                workflow=workflow,
                prep=prep,
                statuses=parse_task_statuses(task_data)
            ).save()

        except Exception as e:
            logger.error('Exception raised when updating Task {} statuses: {}'.format(task_name, e))


@app.task(ignore_result=True, soft_time_limit=3600)
def update_workflows_from_request_manager():
    updated_wfs = []

    logger.debug('Preparing to fetch preps from request manager url {0} and cert at {1}'
                 .format(settings.REQUEST_MANAGER_API_URL, settings.CERT_PATH))

    try:
        wfs = WorkflowToUpdate.objects \
                  .filter(Q(updated__exists=False) |
                          Q(updated__lte=datetime.utcnow() - timedelta(hours=settings.WORKFLOWS_UPDATE_TIMEOUT))
                          )[:settings.WORKFLOWS_UPDATE_LIMIT]
        wfs_count = len(wfs)
        logger.info('Workflows to update {0}'.format(wfs_count))

        if wfs_count == 0:
            return

        preps_data_response = requests \
            .get(settings.REQUEST_MANAGER_API_URL + '?mask=PrepID&mask=RequestName&status=completed',
                 verify=settings.CA_PATH,
                 cert=(settings.CERT_PATH, settings.CERT_KEY_PATH,))
        preps_data = preps_data_response.json()['result'][0]

        # logger.debug('Received JSON response from request manager {0}'.format(preps_data))

        for wf in wfs:
            logger.debug('Updating data for workflow: {0} {1}'.format(wf.name, wf.updated))

            if wf.name not in preps_data:
                logger.debug('Workflow {0} prep not found. Skipping...'.format(wf.name))
                continue

            # mark workflow as updated
            wf.update(updated=datetime.utcnow())

            wf_preps = preps_data[wf.name]['PrepID']
            wf_preps = wf_preps if isinstance(wf_preps, list) else [wf_preps]
            logger.debug('Processing workflow {0}'.format(wf.name))

            for prep_id in wf_preps:
                if prep_id == '666':
                    continue

                logger.debug('Fetch server stats details for:')
                logger.debug('Workflow {0}'.format(wf.name))
                logger.debug('PrepID {0}'.format(prep_id))

                statuses_data_response = requests \
                    .get(settings.SERVER_STATS_API_URL,
                         params={'PrepID': prep_id},
                         verify=settings.CA_PATH,
                         cert=(settings.CERT_PATH, settings.CERT_KEY_PATH,))
                statuses_data = statuses_data_response.json()['result']

                # logger.debug('Received JSON response from server stats {0}'.format(statuses_data))

                for stat in statuses_data:
                    if 'AgentJobInfo' not in stat:
                        continue

                    prep = Prep(
                        name=prep_id,
                        campaign=stat.get('Campaign'),
                        priority=stat.get('RequestPriority'),
                        cpus=stat.get('Multicore'),
                        memory=stat.get('Memory'),
                    )

                    for job, job_data in stat['AgentJobInfo'].items():
                        if 'tasks' not in job_data:
                            continue

                        job_wf = job_data['workflow']

                        logger.debug('Job {0}'.format(job))
                        logger.debug('Workflow {0}'.format(job_wf))

                        workflow = Workflow(name=stat['RequestName'])

                        try:
                            update_workflow_tasks(prep, workflow, job_data)
                        except Exception as e:
                            logger.error('Exception raised when updating Task {} statuses: {}'.format(workflow.name, e))

                        updated_wfs.append(job_wf)


    except Exception as e:
        logger.error('Exception raised: {}'.format(e))

    logger.info('Workflows updated {0}'.format(updated_wfs.count()))
