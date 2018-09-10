import mongoengine

from djangoreactredux.settings.base import *  # NOQA (ignore all errors on this line)
from djangoreactredux.settings.local import *


DEBUG = True

PAGE_CACHE_SECONDS = 1

DATABASES = {
    'default': {
        'ENGINE': '',
    },
    'unified': UNIFIED_DB,
}

MONGODB_DATABASES = {
    'default': {
        'NAME': 'wtc-console',
        'HOST': 'localhost',
        'PORT': 8081,
        'USER': 'root',
        'PASSWORD': 'root',
    }
}

mongoengine.connect(
    db=MONGODB_DATABASES['default']['NAME'],
    host=MONGODB_DATABASES['default']['HOST']
)

REST_FRAMEWORK['EXCEPTION_HANDLER'] = 'django_rest_logger.handlers.rest_exception_handler'  # NOQA (ignore all errors on this line)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'root': {
        'level': 'DEBUG',
        'handlers': ['django_rest_logger_handler'],
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s '
                      '%(process)d %(thread)d %(message)s'
        },
    },
    'handlers': {
        'django_rest_logger_handler': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'django.db.backends': {
            'level': 'ERROR',
            'handlers': ['django_rest_logger_handler'],
            'propagate': False,
        },
        'django_rest_logger': {
            'level': 'DEBUG',
            'handlers': ['django_rest_logger_handler'],
            'propagate': False,
        },
    },
}

DEFAULT_LOGGER = 'django_rest_logger'

LOGGER_EXCEPTION = DEFAULT_LOGGER
LOGGER_ERROR = DEFAULT_LOGGER
LOGGER_WARNING = DEFAULT_LOGGER

CELERY_BROKER_URL = 'amqp://guest:guest@localhost:5672/'

WORKFLOWS_UPDATE_LIMIT = 10
WORKFLOWS_UPDATE_TIMEOUT = 2 # in hours

CA_PATH = '/home/edvinas/workspaces/cern/wtc-console/cert/CERNRootCertificationAuthority2.crt'
CERT_PATH = '/home/edvinas/workspaces/cern/wtc-console/cert/crt.pem'
CERT_KEY_PATH = '/home/edvinas/workspaces/cern/wtc-console/cert/key.pem'
