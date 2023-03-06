#!/bin/bash

echo ${TARGETBUILD} > /buildtarget.txt
if [[ "${TARGETBUILD}" = "aas" ]]; then
    # Azure AppService uses /home for persisent data & SSH on port 2222
    DATA_DIR=/home
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
else
    sed -i "s#DATA_DIR#/data#g" /opt/clouseau/clouseau.ini
    sed -i "s#DATA_DIR#/data#g" /opt/couchdb/etc/local.ini
fi