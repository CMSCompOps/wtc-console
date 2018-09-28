#!/usr/bin/env bash

echo "Stopping Celery workers. If this takes too long, try killing them manually and deleting celeryd.pid"
(cd src && DJANGO_SETTINGS_MODULE=djangoreactredux.settings.dev celery -A djangoreactredux control shutdown) &> /dev/null

# Check if celery workers are stopped
while [ -f src/celeryd.pid ]
do
    echo -n "."
    sleep 1
done

echo ""
echo "Celery workers stopped"
