import mongoengine

from djangoreactredux.settings.dev import *  # NOQA (ignore all errors on this line)
from djangoreactredux.settings.local import *

DATABASES = {
    'default': {
        'ENGINE': '',
    },
    'unified': UNIFIED_DB,
}

MONGODB_DATABASES = {
    'default': {
        'NAME': 'wtc-console',
        'HOST': 'mongo',
        'PORT': 8081,
        'USER': 'root',
        'PASSWORD': 'root',
    }
}

mongoengine.connect(
    db=MONGODB_DATABASES['default']['NAME'],
    host=MONGODB_DATABASES['default']['HOST']
)
