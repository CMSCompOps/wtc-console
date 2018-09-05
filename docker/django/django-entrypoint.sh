#!/usr/bin/env bash

export TNS_ADMIN=/oracle-admin/

until cd src
do
    echo "Waiting for django volume..."
done

python manage.py runserver 0.0.0.0:8000 --settings=djangoreactredux.settings.dev_docker
