#!/usr/bin/env bash
export TNS_ADMIN=/eos/project/o/oracle/public/admin/

# Fetch updates
git pull origin master

# Set virtual environment
source wtc-console-env/bin/activate

# TODO: Build frontend

# Install requirement, update static files, start celery, start server
# TODO change log level to INFO
(cd src/ \
    && python manage.py check --deploy \
    && pip install -r py-requirements/prod.txt \
    && python manage.py collectstatic \
    && gunicorn --bind 0.0.0.0:8000 myproject.wsgi:application \
    && celery -A djangoreactredux worker -l debug -f celery.log --detach -B \
)

# Leave python virtual env
deactivate
