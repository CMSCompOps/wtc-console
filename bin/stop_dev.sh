#!/usr/bin/env bash
(cd src && DJANGO_SETTINGS_MODULE=djangoreactredux.settings.dev celery -A djangoreactredux control shutdown)
