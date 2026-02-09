#!/bin/bash

DATA_DIR=${DATA_DIR:-/data}
COUCHDB_ERLANG_COOKIE=${COUCHDB_ERLANG_COOKIE:-B9CFC32C-3458-4A86-8448-B3C753991CA7}

mkdir -p ${DATA_DIR}
mkdir -p ${DATA_DIR}/couch/{dbs,views}
mkdir -p ${DATA_DIR}/search
chown -R couchdb:couchdb ${DATA_DIR}/couch

echo ${TARGETBUILD} > /buildtarget.txt
if [[ "${TARGETBUILD}" = "aas" ]]; then
    # Azure AppService uses /home for persistent data & SSH on port 2222
    DATA_DIR="${DATA_DIR:-/home}"
    WEBSITES_ENABLE_APP_SERVICE_STORAGE=true
    mkdir -p $DATA_DIR/{search,minio,couch}
    mkdir -p $DATA_DIR/couch/{dbs,views}
    chown -R couchdb:couchdb $DATA_DIR/couch/
    apt update
    apt-get install -y openssh-server
    echo "root:Docker!" | chpasswd
    mkdir -p /tmp
    chmod +x /tmp/ssh_setup.sh \
        && (sleep 1;/tmp/ssh_setup.sh 2>&1 > /dev/null)
    cp /etc/sshd_config /etc/ssh/sshd_config
    /etc/init.d/ssh restart
    sed -i "s#DATA_DIR#/home#g" /opt/clouseau/clouseau.ini
    sed -i "s#DATA_DIR#/home#g" /opt/couchdb/etc/local.ini
elif [[ "${TARGETBUILD}" = "single" ]]; then
    # In the single image build, the Dockerfile specifies /data as a volume
    # mount, so we use that for all persistent data.
    sed -i "s#DATA_DIR#/data#g" /opt/clouseau/clouseau.ini
    sed -i "s#DATA_DIR#/data#g" /opt/couchdb/etc/local.ini
elif [[ "${TARGETBUILD}" = "docker-compose" ]]; then
    # We used to store data in /opt/couchdb/data directly. Now we use /data/couch/dbs 
    # and /data/search to be consistent with other builds and ensure SQS persistence.
    sed -i "s#DATA_DIR#${DATA_DIR}#g" /opt/clouseau/clouseau.ini
    sed -i "s#DATA_DIR#${DATA_DIR}#g" /opt/couchdb/etc/local.ini
elif [[ -n $KUBERNETES_SERVICE_HOST ]]; then
    # In Kubernetes we also want to be consistent with other builds.
    sed -i "s#DATA_DIR#${DATA_DIR}#g" /opt/clouseau/clouseau.ini
    sed -i "s#DATA_DIR#${DATA_DIR}#g" /opt/couchdb/etc/local.ini

    # We remove the -name setting from the vm.args file in Kubernetes because
    # it will default to the pod FQDN, which is what's required for clustering
    # to work.
    sed -i "s/^-name .*$//g" /opt/couchdb/etc/vm.args
else
    # For all other builds, we use /data for persistent data.
    sed -i "s#DATA_DIR#${DATA_DIR}#g" /opt/clouseau/clouseau.ini
    sed -i "s#DATA_DIR#${DATA_DIR}#g" /opt/couchdb/etc/local.ini
fi

# =============================================================================
# MIGRATION LOGIC
# =============================================================================
# This handles upgrades from older versions where data was stored differently.
# Old docker-compose setup stored data directly in /opt/couchdb/data (now /data)
# New setup expects data in /data/couch/dbs/ with views in /data/couch/views/
# =============================================================================

echo "=== CouchDB Data Migration Debug ==="
echo "DATA_DIR=${DATA_DIR}"
echo "TARGETBUILD=${TARGETBUILD}"
echo ""
echo "=== Current directory structure ==="
echo "Listing ${DATA_DIR}:"
ls -la ${DATA_DIR}/ 2>/dev/null || echo "(directory empty or doesn't exist)"
echo ""

# .shards
if [ -d "${DATA_DIR}/.shards" ]; then
    echo "Found .shards directory in ${DATA_DIR}/.shards"
    ls -la ${DATA_DIR}/.shards/ 2>/dev/null
fi

# shards directory
if [ -d "${DATA_DIR}/shards" ]; then
    echo "Found shards directory in ${DATA_DIR}/shards"
    ls -la ${DATA_DIR}/shards/ 2>/dev/null
    echo ""
    echo "Contents of shards subdirectories:"
    find ${DATA_DIR}/shards -type f -name "*.couch" 2>/dev/null | head -20
fi

# .couch files at root level
echo ""
echo "=== Checking for .couch files at root of DATA_DIR ==="
if ls ${DATA_DIR}/*.couch 1> /dev/null 2>&1; then
    echo "Found .couch files in ${DATA_DIR}:"
    ls -la ${DATA_DIR}/*.couch
else
    echo "No .couch files found directly in ${DATA_DIR}"
fi

# _dbs.couch
echo ""
echo "=== Checking for _dbs.couch (CouchDB registry) ==="
if [ -f "${DATA_DIR}/_dbs.couch" ]; then
    echo "Found _dbs.couch at ${DATA_DIR}/_dbs.couch"
elif [ -f "${DATA_DIR}/couch/dbs/_dbs.couch" ]; then
    echo "Found _dbs.couch at ${DATA_DIR}/couch/dbs/_dbs.couch (already migrated)"
else
    echo "No _dbs.couch found"
fi

echo ""
echo "=== Starting Migration ==="

if ls ${DATA_DIR}/*.couch 1> /dev/null 2>&1; then
    echo "MIGRATING: Moving .couch files from ${DATA_DIR}/ to ${DATA_DIR}/couch/dbs/"
    for f in ${DATA_DIR}/*.couch; do
        echo "  Moving: $f -> ${DATA_DIR}/couch/dbs/$(basename $f)"
        mv "$f" "${DATA_DIR}/couch/dbs/"
    done
fi

if [ -d "${DATA_DIR}/shards" ] && [ ! -d "${DATA_DIR}/couch/dbs/shards" ]; then
    echo "MIGRATING: Moving shards directory from ${DATA_DIR}/shards to ${DATA_DIR}/couch/dbs/shards"
    mv "${DATA_DIR}/shards" "${DATA_DIR}/couch/dbs/shards"
    chown -R couchdb:couchdb "${DATA_DIR}/couch/dbs/shards"
fi

if [ -d "${DATA_DIR}/.shards" ] && [ ! -d "${DATA_DIR}/couch/dbs/.shards" ]; then
    echo "MIGRATING: Moving .shards directory from ${DATA_DIR}/.shards to ${DATA_DIR}/couch/dbs/.shards"
    mv "${DATA_DIR}/.shards" "${DATA_DIR}/couch/dbs/.shards"
    chown -R couchdb:couchdb "${DATA_DIR}/couch/dbs/.shards"
fi

if [ -d "${DATA_DIR}/_nodes" ] && [ ! -d "${DATA_DIR}/couch/dbs/_nodes" ]; then
    echo "MIGRATING: Moving _nodes directory from ${DATA_DIR}/_nodes to ${DATA_DIR}/couch/dbs/_nodes"
    mv "${DATA_DIR}/_nodes" "${DATA_DIR}/couch/dbs/_nodes"
    chown -R couchdb:couchdb "${DATA_DIR}/couch/dbs/_nodes"
fi

echo ""
echo "=== Post-Migration directory structure ==="
echo "Listing ${DATA_DIR}/couch/dbs:"
ls -la ${DATA_DIR}/couch/dbs/ 2>/dev/null || echo "(directory empty)"
if [ -d "${DATA_DIR}/couch/dbs/shards" ]; then
    echo ""
    echo "Listing ${DATA_DIR}/couch/dbs/shards:"
    ls -la ${DATA_DIR}/couch/dbs/shards/ 2>/dev/null
fi
echo ""
echo "=== Migration Complete ==="
echo ""

sed -i "s#COUCHDB_ERLANG_COOKIE#${COUCHDB_ERLANG_COOKIE}#g" /opt/couchdb/etc/vm.args
sed -i "s#COUCHDB_ERLANG_COOKIE#${COUCHDB_ERLANG_COOKIE}#g" /opt/clouseau/clouseau.ini

# Start Clouseau. Budibase won't function correctly without Clouseau running, it
# powers the search API endpoints which are used to do all sorts, including
# populating app grids.
/opt/clouseau/bin/clouseau > /dev/stdout 2>&1 &

# Start CouchDB.
/docker-entrypoint.sh /opt/couchdb/bin/couchdb > /dev/stdout 2>&1 &

# Start SQS. Use 127.0.0.1 instead of localhost to avoid IPv6 issues.
/opt/sqs/sqs --server "http://127.0.0.1:5984" --data-dir ${DATA_DIR}/sqs --bind-address=0.0.0.0 --max-threads=20 > /dev/stdout 2>&1 &

# Wait for CouchDB to start up.
while [[ $(curl -s -w "%{http_code}\n" http://localhost:5984/_up -o /dev/null) -ne 200 ]]; do
    echo 'Waiting for CouchDB to start...';
    sleep 5;
done

# CouchDB needs the `_users` and `_replicator` databases to exist before it will
# function correctly, so we create them here.
curl -X PUT -u "${COUCHDB_USER}:${COUCHDB_PASSWORD}" http://localhost:5984/_users
curl -X PUT -u "${COUCHDB_USER}:${COUCHDB_PASSWORD}" http://localhost:5984/_replicator
sleep infinity
