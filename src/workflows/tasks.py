from __future__ import absolute_import, unicode_literals
import datetime
from celery import Celery, shared_task
from celery.utils.log import get_task_logger

app = Celery('workflows')
logger = get_task_logger(__name__)


@shared_task(ignore_result=True)
def print_date():
    dt = datetime.date.today()
    logger.info('Current date {0}'.format(dt))


@app.task
def printout(arg):
    print(arg)
    logger.info('Arg in logger {0}'.format(arg))
