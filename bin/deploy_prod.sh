#!/usr/bin/env bash
export TNS_ADMIN=/eos/project/o/oracle/public/admin/

git pull origin master
cd src/

# Install requirement
pip3.7 install -r py-requirements/prod.txt

# Start celery workers
celery -A djangoreactredux worker -l debug -f celery.log --detach -B
# Start server
python3 manage.py runserver --settings=djangoreactredux.settings.prod
