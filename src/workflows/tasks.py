from __future__ import absolute_import, unicode_literals
from datetime import datetime, timedelta
from celery import Celery, shared_task
from celery.utils.log import get_task_logger
from celery.signals import celeryd_after_setup
from django.conf import settings
from django.db.models import Q
import requests

from unified.models import UnifiedWorkflow
from workflows.models import Prep, Site, Workflow, WorkflowSiteStatus

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

    wtc_wfs = Workflow.objects \
        .all() \
        .values_list('name', flat=True)
    logger.debug('Received wtc-console workflows size {0}'.format(len(wtc_wfs)))

    new_wfs = list(set(unified_wfs) - set(wtc_wfs))
    logger.info('New workflows size {0}'.format(len(new_wfs)))

    for wf_name in new_wfs:
        wf = Workflow(name=wf_name)
        wf.save()
        logger.debug('Added new workflow {0}'.format(wf_name))


@app.task(ignore_result=True, soft_time_limit=3600)
def update_workflows_from_request_manager():
    updated_wfs = []

    logger.debug('Preparing to fetch preps from request manager url {0} and cert at {1}'
                 .format(settings.REQUEST_MANAGER_API_URL, settings.CERT_PATH))

    wfs = Workflow.objects \
              .filter(Q(prep__isnull=True) | Q(updated__lte=datetime.utcnow() - timedelta(hours=2)))[
          :settings.WORKFLOWS_UPDATE_LIMIT]
    wfs_count = wfs.count()
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
        logger.debug('')
        if wf.name not in preps_data:
            logger.debug('Workflow {0} prep not found. Skipping...'.format(wf.name))
            continue

        wf_preps = preps_data[wf.name]['PrepID']
        wf_preps = wf_preps if isinstance(wf_preps, list) else [wf_preps]
        logger.debug('Processing workflow {0}'.format(wf.name))

        if wf.name in updated_wfs:
            logger.debug('Workflow {0} already updated. Skipping...'.format(wf.name))
            continue

        for prep_id in wf_preps:
            if (prep_id == '666'):
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

                prep, _ = Prep.objects.get_or_create(name=prep_id, defaults={'campaign': stat['Campaign']})
                new_wf, _ = Workflow.objects.update_or_create(name=stat['RequestName'], defaults={'prep': prep})
                # delete old states statuses data
                WorkflowSiteStatus.objects.filter(workflow__name=new_wf.name).delete()

                jobs = stat['AgentJobInfo']

                for job, job_data in jobs.items():
                    job_wf = job_data['workflow']
                    updated_wfs.append(job_wf)

                    job_status = job_data['status']
                    total_failures = job_status.get('failure', {'': 0}).values()
                    total_failed_cnt = sum(map(int, total_failures))

                    logger.debug('Job {0}'.format(job))
                    logger.debug('Workflow {0}'.format(job_wf))
                    logger.debug('Success {0}'.format(job_status.get('success', 0)))
                    logger.debug('Failures {0}'.format(total_failed_cnt))

                    for site_name, site_data in job_data['sites'].items():
                        failures = site_data.get('failure', {'': 0}).values()
                        failed_cnt = sum(map(int, failures))
                        logger.debug(
                            'Site {0}, success {1}, failures {2}'.format(site_name, site_data.get('success', 0),
                                                                         failed_cnt))

                        site, _ = Site.objects.get_or_create(name=site_name)
                        wf_site_status = WorkflowSiteStatus(workflow=new_wf,
                                                            site=site,
                                                            site_workflow_name=job_wf,
                                                            success_count=site_data.get('success', 0),
                                                            failed_count=failed_cnt)
                        wf_site_status.save()

    logger.info('Workflows updated {0}'.format(updated_wfs.count()))


@shared_task(ignore_result=True)
def print_date():
    dt = datetime.now()
    logger.info('Current date {0}'.format(dt))
