#!/usr/bin/env bash
export TNS_ADMIN=../oracle-admin/
(cd src/ \
    && celery -A djangoreactredux worker -l debug -f celery.log --detach -B \
    && python manage.py runserver 0.0.0.0:8000 --settings=djangoreactredux.settings.dev \
)
