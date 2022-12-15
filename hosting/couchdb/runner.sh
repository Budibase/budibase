#!/bin/bash

DATA_DIR=${DATA_DIR:-/data}
mkdir -p ${DATA_DIR}
mkdir -p ${DATA_DIR}/couch/{dbs,views}
mkdir -p ${DATA_DIR}/search
chown -R couchdb:couchdb ${DATA_DIR}/couch
/build-target-paths.sh
/opt/clouseau/bin/clouseau > /dev/stdout 2>&1 &
/docker-entrypoint.sh /opt/couchdb/bin/couchdb &
sleep 10
curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/_users
curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/_replicator
sleep infinity