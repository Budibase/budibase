#!/bin/bash

DATA_DIR=${DATA_DIR:-/data}

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
    sed -i "s#DATA_DIR#/data#g" /opt/clouseau/clouseau.ini
    sed -i "s#DATA_DIR#/data#g" /opt/couchdb/etc/local.ini
elif [[ -n $KUBERNETES_SERVICE_HOST ]]; then
    # In Kubernetes the directory /opt/couchdb/data has a persistent volume
    # mount for storing database data.
    sed -i "s#DATA_DIR#/opt/couchdb/data#g" /opt/clouseau/clouseau.ini
    sed -i "s#DATA_DIR#/opt/couchdb/data#g" /opt/couchdb/etc/local.ini
    sed -i "s/^-name .*$//g" /opt/couchdb/etc/vm.args
else
    sed -i "s#DATA_DIR#/data#g" /opt/clouseau/clouseau.ini
    sed -i "s#DATA_DIR#/data#g" /opt/couchdb/etc/local.ini
fi

/opt/clouseau/bin/clouseau > /dev/stdout 2>&1 &
/docker-entrypoint.sh /opt/couchdb/bin/couchdb &

while [[ $(curl -s -w "%{http_code}\n" http://localhost:5984/_up -o /dev/null) -ne 200 ]]; do
    echo 'Waiting for CouchDB to start...';
    sleep 5;
done

curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/_users
curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/_replicator
sleep infinity