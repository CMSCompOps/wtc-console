from __future__ import absolute_import, unicode_literals
from datetime import datetime, timedelta
from celery import Celery
from celery.utils.log import get_task_logger
from django.conf import settings
from mongoengine.queryset.visitor import Q
import requests

from unified.models import UnifiedWorkflow
from workflows.models import Prep, Site, Workflow, WorkflowToUpdate, Task, TaskSiteStatus

app = Celery('workflows')
logger = get_task_logger(__name__)


@app.task(ignore_result=True)
def fetch_new_workflows_from_unified():
    logger.debug('Preparing to fetch workflows from Unified')

    try:
        unified_wfs = UnifiedWorkflow.objects \
            .filter(status__icontains='manual') \
            .values_list('name', flat=True)
        logger.info('Received unified workflows with status manual size {}'.format(len(unified_wfs)))

        wtc_wfs = WorkflowToUpdate.objects \
            .all() \
            .values_list('name')
        logger.debug('Received wtc-console workflows size {}'.format(len(wtc_wfs)))

        new_wfs = list(set(unified_wfs) - set(wtc_wfs))
        logger.info('New workflows size {}'.format(len(new_wfs)))

        for wf_name in new_wfs:
            WorkflowToUpdate(name=wf_name).save()
            logger.debug('Added new workflow {}'.format(wf_name))

    except Exception as e:
        logger.error('Exception raised: {}'.format(e))


def parse_task_statuses(task_data):
    statuses = []

    for site_name, site_data in task_data['sites'].items():
        failures = site_data.get('failure', {'': 0}).values()
        failed_cnt = sum(map(int, failures))

        logger.debug(
            'Site {}, success {}, failures {}'.format(site_name, site_data.get('success', 0),
                                                         failed_cnt))

        dataset_keys = site_data.get('dataset', {'': {}}).keys()
        dataset = list(dataset_keys)[0] if dataset_keys else ''

        # TODO: Remove this after implementing drain statuses retrieval
        site = Site(name=site_name)
        site.save()

        statuses.append(TaskSiteStatus(
            site=site_name,
            dataset=dataset,
            success_count=site_data.get('success', 0),
            failed_count=failed_cnt,
        ))

    return statuses


def get_failures_count(statuses):
    cnt = 0

    for status in statuses:
        cnt += status.failed_count

    return cnt


def update_workflow_tasks(prep, workflow, job_data):
    for task_name, task_data in job_data['tasks'].items():
        if 'sites' not in task_data:
            continue

        job_type = task_data.get('jobtype', '')

        if not job_type or job_type in settings.SKIP_JOB_TYPES:
            continue

        statuses = parse_task_statuses(task_data)
        failures_count = get_failures_count(statuses)
        logger.debug('Failures count {} for wf {}'.format(failures_count, workflow.name))

        try:
            Task(
                name=task_name,
                job_type=task_data.get('jobtype'),
                failures_count=failures_count,
                updated=datetime.utcnow(),
                workflow=workflow,
                prep=prep,
                statuses=statuses,
            ).save()

        except Exception as e:
            logger.error('Exception raised when updating Task {} statuses: {}'.format(task_name, e))


@app.task(ignore_result=True, soft_time_limit=3600)
def update_workflows_from_request_manager():
    updated_wfs = []

    logger.debug('Preparing to fetch preps from request manager url {} and cert at {}'
                 .format(settings.REQUEST_MANAGER_API_URL, settings.CERT_PATH))

    try:
        wfs = WorkflowToUpdate.objects \
                  .filter(Q(updated__exists=False) |
                          Q(updated__lte=datetime.utcnow() - timedelta(hours=settings.WORKFLOWS_UPDATE_TIMEOUT))) \
                  .order_by('updated')[:settings.WORKFLOWS_UPDATE_LIMIT]
        wfs_count = len(wfs)
        logger.info('Workflows to update {}'.format(wfs_count))

        if wfs_count == 0:
            return

        preps_data_response = requests \
            .get(settings.REQUEST_MANAGER_API_URL + '?mask=PrepID&mask=RequestName&status=completed',
                 verify=settings.CA_PATH,
                 cert=(settings.CERT_PATH, settings.CERT_KEY_PATH,))
        preps_data = preps_data_response.json()['result'][0]

        # logger.debug('Received JSON response from request manager {0}'.format(preps_data))

        for wf in wfs:
            logger.debug('Updating data for workflow: {} {}'.format(wf.name, wf.updated))

            if wf.name not in preps_data:
                logger.debug('Workflow {} prep not found. Skipping...'.format(wf.name))
                continue

            # mark workflow as updated
            wf.update(updated=datetime.utcnow())

            wf_preps = preps_data[wf.name]['PrepID']
            wf_preps = wf_preps if isinstance(wf_preps, list) else [wf_preps]
            logger.debug('Processing workflow {}'.format(wf.name))

            for prep_id in wf_preps:
                if prep_id == '666':
                    continue

                logger.debug('Fetch server stats details for:')
                logger.debug('Workflow {}'.format(wf.name))
                logger.debug('PrepID {}'.format(prep_id))

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

                        logger.debug('Job {}'.format(job))
                        logger.debug('Workflow {}'.format(job_wf))

                        workflow = Workflow(name=stat['RequestName'])

                        try:
                            update_workflow_tasks(prep, workflow, job_data)
                        except Exception as e:
                            logger.error('Exception raised when updating Task {} statuses: {}'.format(workflow.name, e))

                        updated_wfs.append(job_wf)


    except Exception as e:
        logger.error('Exception raised: {}'.format(e))

    logger.info('Workflows updated {}'.format(len(updated_wfs)))
