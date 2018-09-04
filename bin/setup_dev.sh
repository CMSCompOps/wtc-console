#!/usr/bin/env bash
export TNS_ADMIN=../oracle-admin/
(cd src/ \
    && pip3 install -r py-requirements/dev.txt \
    && python3 manage.py migrate --settings=djangoreactredux.settings.dev \
    && python3 manage.py loaddata fixtures.json --settings=djangoreactredux.settings.dev_docker
)
