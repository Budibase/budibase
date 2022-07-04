#!/bin/bash

echo ${TARGETBUILD} > /buildtarget.txt
if [[ "${TARGETBUILD}" = "aas" ]]; then
    # Azure AppService uses /home for persisent data & SSH on port 2222
    mkdir -p /home/budibase/{minio,couchdb}
    mkdir -p  /home/budibase/couchdb/data
    chown -R couchdb:couchdb /home/budibase/couchdb/
    apt update
    apt-get install -y openssh-server
    sed -i 's#dir=/opt/couchdb/data/search#dir=/home/budibase/couchdb/data/search#' /opt/clouseau/clouseau.ini
    sed -i 's#/minio/minio server /minio &#/minio/minio server /home/budibase/minio &#' /runner.sh
    sed -i 's#database_dir = ./data#database_dir = /home/budibase/couchdb/data#' /opt/couchdb/etc/default.ini
    sed -i 's#view_index_dir = ./data#view_index_dir = /home/budibase/couchdb/data#' /opt/couchdb/etc/default.ini
    sed -i "s/#Port 22/Port 2222/" /etc/ssh/sshd_config
    /etc/init.d/ssh restart
fi
