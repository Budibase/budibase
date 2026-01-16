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

# Migration logic: if we find .couch files in the root DATA_DIR, move them to the subfolder.
# This handles upgrades from older versions where data was stored directly in DATA_DIR.
if ls ${DATA_DIR}/*.couch 1> /dev/null 2>&1; then
    echo "Found existing .couch files in ${DATA_DIR}. Migrating to ${DATA_DIR}/couch/dbs/..."
    mv ${DATA_DIR}/*.couch ${DATA_DIR}/couch/dbs/
fi

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
