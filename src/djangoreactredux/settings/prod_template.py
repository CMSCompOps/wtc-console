import mongoengine

from djangoreactredux.settings.base import *  # NOQA (ignore all errors on this line)

# TODO Change to False
DEBUG = True
TEMPLATE_DEBUG = DEBUG

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
        'PORT': 8081,
        'USER': 'root',
        'PASSWORD': 'root',
    }
}

mongoengine.connect(
    db=MONGODB_DATABASES['default']['NAME'],
    host=MONGODB_DATABASES['default']['HOST']
)

REST_FRAMEWORK[
    'EXCEPTION_HANDLER'] = 'django_rest_logger.handlers.rest_exception_handler'  # NOQA (ignore all errors on this line)

# TODO change log levels to INFO
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
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'filename': '/var/log/wtc-console/debug.log',
            'when': 'd',
            'interval': '1',
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

# TODO remove
WORKFLOWS_UPDATE_LIMIT = 10
WORKFLOWS_UPDATE_TIMEOUT = 2  # in hours

CA_PATH = '/path/to/CERNRootCertificationAuthority2.crt'
CERT_PATH = '/path/to/crt.pem'
CERT_KEY_PATH = '/path/to/key.pem'
