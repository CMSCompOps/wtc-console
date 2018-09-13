#!/usr/bin/env bash

# Stop celery workers
echo "Stopping Celery workers. If this takes too long, try killing them manually and deleting celeryd.pid"
echo "Ignore the error: No nodes replied within time constraint"
(cd src \
    && source ../wtc-console-env/bin/activate \
    && DJANGO_SETTINGS_MODULE=djangoreactredux.settings.prod celery -A djangoreactredux control shutdown \
)

# Check if celery workers are stopped
while [ -f src/celeryd.pid ]
do
    echo -n "."
    sleep 1
done

echo ""
echo "Celery workers stopped"

echo "Stopping Gunicorn"
(cd src \
    && source ../wtc-console-env/bin/activate \
    && pkill gunicorn \
)
