#!/usr/bin/env bash
export TNS_ADMIN=../oracle-admin/
(cd src/ && pip install -r ../py-requirements/dev.txt)
