#!/bin/bash

/docker-entrypoint.sh /opt/couchdb/bin/couchdb &
sleep 10
curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/_users
curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/_replicator
sleep infinity