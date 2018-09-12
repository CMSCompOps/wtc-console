#!/usr/bin/env bash

# Stop celery workers
echo "Stopping Celery workers. If this takes too long, try killing them manually and deleting celeryd.pid"
(cd src \
    && source ../wtc-console-env/bin/activate \
    && DJANGO_SETTINGS_MODULE=djangoreactredux.settings.prod celery -A djangoreactredux control shutdown \
)

# Check if celery workers are stopped
while [ -f src/celeryd.pid ]
do
    echo "."
    sleep 2
done

echo "Stopping Gunicorn"
(cd src \
    && source ../wtc-console-env/bin/activate \
    && pkill gunicorn \
)
