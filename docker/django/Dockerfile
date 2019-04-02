FROM python:3.4.3
#FROM container-registry.oracle.com/database/instantclient:12.2.0.1

RUN python -V

ENV PYTHONUNBUFFERED 1

COPY ./docker/django/django-entrypoint.sh /
COPY ./py-requirements /django/py-requirements
#COPY ./oracle-admin /

WORKDIR /django

RUN pip install pip==10.0.1
RUN pip install -r py-requirements/dev.txt
