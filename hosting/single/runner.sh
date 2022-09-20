#!/bin/bash
declare -a ENV_VARS=("COUCHDB_USER" "COUCHDB_PASSWORD" "DATA_DIR" "MINIO_ACCESS_KEY" "MINIO_SECRET_KEY" "INTERNAL_API_KEY" "JWT_SECRET" "REDIS_PASSWORD")
declare -a DOCKER_VARS=("APP_PORT" "APPS_URL" "ARCHITECTURE" "BUDIBASE_ENVIRONMENT" "CLUSTER_PORT" "DEPLOYMENT_ENVIRONMENT" "MINIO_URL" "NODE_ENV" "POSTHOG_TOKEN" "REDIS_URL" "SELF_HOSTED" "WORKER_PORT" "WORKER_URL")
# Check the env vars set in Dockerfile have come through, AAS seems to drop them
[[ -z "${APP_PORT}" ]] && export APP_PORT=4001
[[ -z "${ARCHITECTURE}" ]] && export ARCHITECTURE=amd
[[ -z "${BUDIBASE_ENVIRONMENT}" ]] && export BUDIBASE_ENVIRONMENT=PRODUCTION
[[ -z "${CLUSTER_PORT}" ]] && export CLUSTER_PORT=80
[[ -z "${DEPLOYMENT_ENVIRONMENT}" ]] && export DEPLOYMENT_ENVIRONMENT=docker
[[ -z "${MINIO_URL}" ]] && export MINIO_URL=http://localhost:9000
[[ -z "${NODE_ENV}" ]] && export NODE_ENV=production
[[ -z "${POSTHOG_TOKEN}" ]] && export POSTHOG_TOKEN=phc_bIjZL7oh2GEUd2vqvTBH8WvrX0fWTFQMs6H5KQxiUxU
[[ -z "${REDIS_URL}" ]] && export REDIS_URL=localhost:6379
[[ -z "${SELF_HOSTED}" ]] && export SELF_HOSTED=1
[[ -z "${WORKER_PORT}" ]] && export WORKER_PORT=4002
[[ -z "${WORKER_URL}" ]] && export WORKER_URL=http://localhost:4002
[[ -z "${APPS_URL}" ]] && export APPS_URL=http://localhost:4001
#  export CUSTOM_DOMAIN=budi001.custom.com
# Azure App Service customisations
if [[ "${TARGETBUILD}" = "aas" ]]; then
    DATA_DIR=/home
    /etc/init.d/ssh start
else
    DATA_DIR=${DATA_DIR:-/data}
fi

if [ -f "${DATA_DIR}/.env" ]; then
    # Read in the .env file and export the variables
    for LINE in $(cat ${DATA_DIR}/.env); do export $LINE; done
fi
# randomise any unset environment variables
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
if [ ! -f "${DATA_DIR}/.env" ]; then
    touch ${DATA_DIR}/.env
    for ENV_VAR in "${ENV_VARS[@]}"
    do
        temp=$(eval "echo \$$ENV_VAR")
        echo "$ENV_VAR=$temp" >> ${DATA_DIR}/.env
    done
    for ENV_VAR in "${DOCKER_VARS[@]}"
    do
        temp=$(eval "echo \$$ENV_VAR")
        echo "$ENV_VAR=$temp" >> ${DATA_DIR}/.env
    done
    echo "COUCH_DB_URL=${COUCH_DB_URL}" >> ${DATA_DIR}/.env
fi

# Read in the .env file and export the variables
for LINE in $(cat ${DATA_DIR}/.env); do export $LINE; done
ln -s ${DATA_DIR}/.env /app/.env
ln -s ${DATA_DIR}/.env /worker/.env
# make these directories in runner, incase of mount
mkdir -p ${DATA_DIR}/couch/{dbs,views}
mkdir -p ${DATA_DIR}/minio
mkdir -p ${DATA_DIR}/search
chown -R couchdb:couchdb ${DATA_DIR}/couch
redis-server --requirepass $REDIS_PASSWORD &
/opt/clouseau/bin/clouseau &
/minio/minio server ${DATA_DIR}/minio &
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
