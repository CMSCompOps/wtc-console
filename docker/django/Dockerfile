FROM python:3.4.3

RUN python -V

ENV PYTHONUNBUFFERED 1

COPY ./docker/django/django-entrypoint.sh /
COPY ./py-requirements /django/py-requirements

WORKDIR /django

RUN pip install pip==10.0.1
RUN pip install -r py-requirements/dev.txt
