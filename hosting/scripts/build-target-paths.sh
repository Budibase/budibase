#!/bin/bash

echo ${TARGETBUILD} > /buildtarget.txt
if [[ "${TARGETBUILD}" = "aas" ]]; then
    # Azure AppService uses /home for persisent data & SSH on port 2222
    mkdir -p /home/{search,minio,couch}
    mkdir -p /home/couch/{dbs,views}
    chown -R couchdb:couchdb /home/couch/
    apt update
    apt-get install -y openssh-server
    sed -i 's#dir=/opt/couchdb/data/search#dir=/home/search#' /opt/clouseau/clouseau.ini
    sed -i 's#/minio/minio server /minio &#/minio/minio server /home/minio &#' /runner.sh
    sed -i 's#database_dir = ./data#database_dir = /home/couch/dbs#' /opt/couchdb/etc/default.ini
    sed -i 's#view_index_dir = ./data#view_index_dir = /home/couch/views#' /opt/couchdb/etc/default.ini
    sed -i "s/#Port 22/Port 2222/" /etc/ssh/sshd_config
    /etc/init.d/ssh restart
fi
