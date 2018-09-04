#!/usr/bin/env bash
export TNS_ADMIN=../oracle-admin/
(cd src/ && pip3 install -r ../py-requirements/dev.txt)
