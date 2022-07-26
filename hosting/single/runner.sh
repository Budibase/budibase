#!/bin/bash
declare -a ENV_VARS=("COUCHDB_USER" "COUCHDB_PASSWORD" "MINIO_ACCESS_KEY" "MINIO_SECRET_KEY" "INTERNAL_API_KEY" "JWT_SECRET" "REDIS_PASSWORD")
if [ -f "/data/.env" ]; then
    export $(cat /data/.env | xargs)
fi
# first randomise any unset environment variables
for ENV_VAR in "${ENV_VARS[@]}"
do
    temp=$(eval "echo \$$ENV_VAR")
    if [[ -z "${temp}" ]]; then
        eval "export $ENV_VAR=$(uuidgen | sed -e 's/-//g')"
    fi
done
if [[ -z "${COUCH_DB_URL}" ]]; then
    export COUCH_DB_URL=http://$COUCHDB_USER:$COUCHDB_PASSWORD@localhost:5984
fi
if [ ! -f "/data/.env" ]; then
    touch /data/.env
    for ENV_VAR in "${ENV_VARS[@]}"
    do
        temp=$(eval "echo \$$ENV_VAR")
        echo "$ENV_VAR=$temp" >> /data/.env
    done
fi

# make these directories in runner, incase of mount
mkdir -p /data/couch/{dbs,views} /home/couch/{dbs,views}
chown -R couchdb:couchdb /data/couch /home/couch
redis-server --requirepass $REDIS_PASSWORD &
/opt/clouseau/bin/clouseau &
/minio/minio server /data/minio &
/docker-entrypoint.sh /opt/couchdb/bin/couchdb &
/etc/init.d/nginx restart
if [[ ! -z "${CUSTOM_DOMAIN}" ]]; then
    # Add monthly cron job to renew certbot certificate
    echo -n "* * 2 * * root exec /app/letsencrypt/certificate-renew.sh ${CUSTOM_DOMAIN}" >> /etc/cron.d/certificate-renew
    chmod +x /etc/cron.d/certificate-renew
    # Request the certbot certificate
    /app/letsencrypt/certificate-request.sh ${CUSTOM_DOMAIN}
fi

/etc/init.d/nginx restart
pushd app
pm2 start --name app "yarn run:docker"
popd
pushd worker
pm2 start --name worker "yarn run:docker"
popd
sleep 10
curl -X PUT ${COUCH_DB_URL}/_users
curl -X PUT ${COUCH_DB_URL}/_replicator
sleep infinity
