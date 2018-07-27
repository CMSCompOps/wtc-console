from __future__ import absolute_import, unicode_literals
from datetime import datetime, timedelta
from celery import Celery, shared_task
from celery.utils.log import get_task_logger
from celery.signals import celeryd_after_setup
from django.conf import settings
from django.db.models import Q
import requests
from unified.models import UnifiedWorkflow
from workflows.models import Workflow

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


@app.task(ignore_result=True)
def update_workflows_from_request_manager():
    logger.debug('Preparing to fetch preps from request manager url {0} and cert at {1}'
                 .format(settings.REQUEST_MANAGER_API_URL, settings.REQUEST_MANAGER_CERT_PATH))

    wfs = Workflow.objects \
        .filter(Q(prep__isnull=True) | Q(updated__lte=datetime.now()-timedelta(hours=2)))
    wfs_count  = wfs.count()
    logger.debug('Workflows to update {0}'.format(wfs_count))

    if wfs_count > 0:
        preps_data_response = requests\
            .get(settings.REQUEST_MANAGER_API_URL + '?mask=PrepID&mask=RequestName&status=completed',
                 cert=settings.REQUEST_MANAGER_CERT_PATH)
        preps_data = preps_data_response.json()

        logger.debug('Received JSON response from request manager {0}'.format(preps_data))


        for wf in wfs:
            logger.debug('Updated workflow {0}'.format(wf.name))


@shared_task(ignore_result=True)
def print_date():
    dt = datetime.now()
    logger.info('Current date {0}'.format(dt))
