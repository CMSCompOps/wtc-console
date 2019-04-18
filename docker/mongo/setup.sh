#! /bin/bash

tar -xf /to_restore/wtc_console_dev.tar.gz
mongorestore -d wtc-console /wtc_console_dev
