#!/usr/bin/env bash
export TNS_ADMIN=../oracle-admin/
(cd src/ \
    && DJANGO_SETTINGS_MODULE=djangoreactredux.settings.dev celery -A djangoreactredux worker -l debug -f ../logs/celery.log --detach -B \
    && python manage.py runserver 0.0.0.0:8000 --settings=djangoreactredux.settings.dev \
)

