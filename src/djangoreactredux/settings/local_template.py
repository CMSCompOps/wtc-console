# A place for secret local/dev environment settings

UNIFIED_DB = {
    'ENGINE': 'django.db.backends.oracle',
    'NAME': 'DB_NAME',
    'USER': 'username',
    'PASSWORD': 'password',
}

MONGODB_DATABASES = {
    'default': {
        'NAME': 'wtc-console',
        'USER': 'root',
        'PASSWORD': 'root',
    }
}
