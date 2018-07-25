#!/usr/bin/env bash
python3 manage.py migrate
celery -A djangoreactredux worker -l info -f celery.log --detach -B
python3 manage.py runserver 0.0.0.0:8000 --settings=djangoreactredux.settings.dev
