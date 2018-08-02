#!/usr/bin/env bash
export TNS_ADMIN=../oracle-admin/
python3 manage.py migrate --settings=djangoreactredux.settings.dev
celery -A djangoreactredux worker -l debug -f celery.log --detach -B
python3 manage.py runserver 0.0.0.0:8000 --settings=djangoreactredux.settings.dev
