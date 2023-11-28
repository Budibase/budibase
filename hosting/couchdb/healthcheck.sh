#!/usr/bin/env bash
healthy=true

if [[ $(curl -s -w "%{http_code}\n" http://localhost:5984/_up -o /dev/null) -ne 200 ]]; then
    echo 'ERROR: CouchDB is not running';
    healthy=false
fi

if [ $healthy == true ]; then
  exit 0
else
  exit 1
fi
