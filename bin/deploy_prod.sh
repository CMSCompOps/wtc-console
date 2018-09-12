#!/usr/bin/env bash
export TNS_ADMIN=/afs/cern.ch/project/oracle/admin/

# Fetch updates
git pull origin master

# Build frontend for production
npm install
npm run prod

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

# Install requirement, update static files, start celery, start server
(cd src/ \
    && source ../wtc-console-env/bin/activate \
    && pip install -r ../py-requirements/prod.txt \
    && python manage.py check --deploy --settings=djangoreactredux.settings.prod \
    && python manage.py collectstatic --noinput --settings=djangoreactredux.settings.prod \
    && gunicorn --bind 0.0.0.0:8000 --daemon --env DJANGO_SETTINGS_MODULE=djangoreactredux.settings.prod djangoreactredux.wsgi:application \
)

echo "Gunicorn started"

(cd src/ \
    && source ../wtc-console-env/bin/activate \
    && DJANGO_SETTINGS_MODULE=djangoreactredux.settings.prod celery -A djangoreactredux worker -l INFO -f ../logs/celery.log --detach -B \
)

echo "Celery started"
