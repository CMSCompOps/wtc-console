from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoreactredux.settings.dev')

app = Celery('djangoreactredux')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'fetch-new-workflows-from-unified-task': {
        'task': 'workflows.tasks.fetch_new_workflows_from_unified',
        'schedule': 1 * 60.0, # every minute
    },
    'update-workflows-from-request-manager-task': {
        'task': 'workflows.tasks.update_workflows_from_request_manager',
        'schedule': 10 * 60.0, # every 10 minutes
    },
}

app.conf.timezone = 'UTC'


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
