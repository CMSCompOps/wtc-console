import mongoengine

from djangoreactredux.settings.base import *  # NOQA (ignore all errors on this line)

DEBUG = False
PAGE_CACHE_SECONDS = 60

# TODO: in a real production server this should have a proper url
ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': '',
    },
    'unified': {
        'ENGINE': 'django.db.backends.oracle',
        'NAME': 'DB_NAME',
        'USER': 'username',
        'PASSWORD': 'password',
    }
}

MONGODB_DATABASES = {
    'default': {
        'NAME': 'wtc-console',
        'HOST': 'localhost',
    }
}

mongoengine.connect(
    db=MONGODB_DATABASES['default']['NAME'],
    host=MONGODB_DATABASES['default']['HOST']
)

REST_FRAMEWORK[
    'EXCEPTION_HANDLER'] = 'django_rest_logger.handlers.rest_exception_handler'  # NOQA (ignore all errors on this line)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'root': {
        'level': 'INFO',
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
            'level': 'INFO',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'filename': '../logs/application.log',
            'when': 'd',
            'interval': 1,
            'utc': True,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django.db.backends': {
            'level': 'ERROR',
            'handlers': ['django_rest_logger_handler'],
            'propagate': False,
        },
        'django_rest_logger': {
            'level': 'INFO',
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

WORKFLOWS_UPDATE_LIMIT = 100
WORKFLOWS_UPDATE_TIMEOUT = 1  # in hours

CA_PATH = '../cert/CERNRootCertificationAuthority2.crt'
CERT_PATH = '../cert/crt.pem'
CERT_KEY_PATH = '../cert/key.pem'
