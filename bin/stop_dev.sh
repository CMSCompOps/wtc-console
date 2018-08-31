#!/usr/bin/env bash
(cd src && celery -A djangoreactredux control shutdown)
