#!/usr/bin/env bash
export TNS_ADMIN=/eos/project/o/oracle/public/admin/

# Fetch updates
git pull origin master

# Build frontend for production
npm install
npm run prod

# Stop celery workers
echo "Stopping Celery workers. If this takes too long, try killing them manually and deleting celeryd.pid\n"
(cd src \
    && source wtc-console-env/bin/activate \
    && celery -A djangoreactredux control shutdown \
)

# Check if celery workers are stopped
while [ -f src/celeryd.pid ]
do
    echo "."
    sleep 2
done

# Install requirement, update static files, start celery, start server
# TODO change celery log level to INFO
(cd src/ \
    && source wtc-console-env/bin/activate \
    && python manage.py check --deploy \
    && pip install -r py-requirements/prod.txt \
    && python manage.py collectstatic \
    && gunicorn --bind 0.0.0.0:8000 myproject.wsgi:application \
    && celery -A djangoreactredux worker -l debug -f celery.log --detach -B \
)
