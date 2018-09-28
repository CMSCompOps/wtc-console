from __future__ import absolute_import, unicode_literals
from datetime import datetime, timedelta
from celery import Celery
from celery.signals import celeryd_after_setup
from celery.utils.log import get_task_logger
from django.conf import settings
from mongoengine.queryset.visitor import Q
import requests

from unified.models import UnifiedWorkflow
from workflows.models import Prep, Site, WorkflowToUpdate, Task, TaskSiteStatus, TaskPrep, Workflow

app = Celery('workflows')
logger = get_task_logger(__name__)


@celeryd_after_setup.connect
def setup_direct_queue(sender, instance, **kwargs):
    logger.info('Fetch workflows from Unified on startup')
    # fetch_new_workflows_from_unified.delay()
    update_workflows_from_request_manager.delay()


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
        try:
            failures = site_data.get('failure', {'': 0}).values()
            failed_cnt = sum(map(int, failures))

            logger.debug(
                'Site {}, success {}, failures {}'.format(site_name, site_data.get('success', 0), failed_cnt))

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
        except Exception as e:
            logger.error('Exception raised when reading status of site {}: {}'.format(site_name, e))

    return statuses


def get_failures_count(statuses):
    cnt = 0

    for status in statuses:
        cnt += status.failed_count

    return cnt


def update_workflow_tasks(prep, workflow, parent_workflow, tasks_data):
    tasks = []
    for task_name, task_data in tasks_data:
        if 'sites' not in task_data:
            continue

        job_type = task_data.get('jobtype', '')

        if not job_type or job_type in settings.SKIP_JOB_TYPES:
            continue

        statuses = parse_task_statuses(task_data)
        failures_count = get_failures_count(statuses)

        try:
            task = Task(
                name=task_name,
                workflow=workflow,
                parent_workflow=parent_workflow,
                job_type=job_type,
                failures_count=failures_count,
                prep=prep,
                statuses=statuses,
            )
            tasks.append(task)

        except Exception as e:
            logger.error('Exception raised when updating Task {}: {}'.format(task_name, e))

    return tasks


@app.task(ignore_result=True, soft_time_limit=3600)
def update_workflows_from_request_manager():
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

        # TODO old data cleanup here

        updated_preps = []

        for wf in wfs:
            logger.debug('Updating data for unified workflow: {} {}'.format(wf.name, wf.updated))

            if wf.name not in preps_data:
                logger.debug('Workflow {} prep not found. Skipping...'.format(wf.name))
                # TODO: delete wf from unified_workflows, cleanup current preps if they are not in this list, remove tasks - function
                continue

            # mark workflow as updated
            wf.update(updated=datetime.utcnow())

            prep_ids = preps_data[wf.name]['PrepID']
            prep_ids = prep_ids if isinstance(prep_ids, list) else [prep_ids]
            logger.debug('Processing workflow {}'.format(wf.name))

            for prep_id in prep_ids:
                if prep_id == '666':
                    continue

                logger.debug('Fetch wmstats details for PrepID: {}'.format(prep_id))

                statuses_data_response = requests \
                    .get(settings.SERVER_STATS_API_URL,
                         params={'PrepID': prep_id},
                         verify=settings.CA_PATH,
                         cert=(settings.CERT_PATH, settings.CERT_KEY_PATH,))
                statuses_data = statuses_data_response.json()['result']

                campaign = ''
                priority = 0
                workflows = []

                for stat in statuses_data:
                    logger.debug('In statuses loop: {}'.format(prep_id))
                    if not campaign:
                        campaign = stat.get('Campaign')
                        priority = stat.get('RequestPriority')

                    if 'AgentJobInfo' not in stat:
                        continue

                    task_prep = TaskPrep(
                        name=prep_id,
                        campaign=campaign,
                        priority=priority,
                    )

                    workflow_name = stat['RequestName']
                    parent_workflow = stat.get('OriginalRequestName', '')

                    logger.debug('Workflow {}, Parent workflow {}'.format(workflow_name, parent_workflow))

                    tasks = []

                    for job, job_data in stat['AgentJobInfo'].items():
                        if 'tasks' not in job_data:
                            continue

                        logger.debug('Job {}'.format(job))

                        try:
                            tasks.extend(update_workflow_tasks(task_prep, workflow_name, parent_workflow, job_data['tasks'].items()))

                        except Exception as e:
                            logger.error(
                                'Exception raised when updating Workflow {} tasks: {}'.format(workflow_name, e))

                    workflows.append(
                        Workflow(
                            name=workflow_name,
                            parent_workflow=parent_workflow,
                            tasks=tasks
                        )
                    )

                Prep(
                    name=prep_id,
                    campaign=campaign,
                    priority=priority,
                    updated=datetime.utcnow(),
                    workflows=workflows
                ).save()

                updated_preps.append(prep_id)

        logger.info('Workflows updated {}'.format(len(updated_preps)))

    except Exception as e:
        logger.error('Exception raised: {}'.format(e))
