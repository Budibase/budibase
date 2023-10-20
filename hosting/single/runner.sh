#!/bin/bash
declare -a ENV_VARS=("COUCHDB_USER" "COUCHDB_PASSWORD" "DATA_DIR" "MINIO_ACCESS_KEY" "MINIO_SECRET_KEY" "INTERNAL_API_KEY" "JWT_SECRET" "REDIS_PASSWORD")
declare -a DOCKER_VARS=("APP_PORT" "APPS_URL" "ARCHITECTURE" "BUDIBASE_ENVIRONMENT" "CLUSTER_PORT" "DEPLOYMENT_ENVIRONMENT" "MINIO_URL" "NODE_ENV" "POSTHOG_TOKEN" "REDIS_URL" "SELF_HOSTED" "WORKER_PORT" "WORKER_URL" "TENANT_FEATURE_FLAGS" "ACCOUNT_PORTAL_URL")
# Check the env vars set in Dockerfile have come through, AAS seems to drop them
[[ -z "${APP_PORT}" ]] && export APP_PORT=4001
[[ -z "${ARCHITECTURE}" ]] && export ARCHITECTURE=amd
[[ -z "${BUDIBASE_ENVIRONMENT}" ]] && export BUDIBASE_ENVIRONMENT=PRODUCTION
[[ -z "${CLUSTER_PORT}" ]] && export CLUSTER_PORT=80
[[ -z "${DEPLOYMENT_ENVIRONMENT}" ]] && export DEPLOYMENT_ENVIRONMENT=docker
[[ -z "${MINIO_URL}" ]] && export MINIO_URL=http://localhost:9000
[[ -z "${NODE_ENV}" ]] && export NODE_ENV=production
[[ -z "${POSTHOG_TOKEN}" ]] && export POSTHOG_TOKEN=phc_bIjZL7oh2GEUd2vqvTBH8WvrX0fWTFQMs6H5KQxiUxU
[[ -z "${TENANT_FEATURE_FLAGS}" ]] && export TENANT_FEATURE_FLAGS="*:LICENSING,*:USER_GROUPS,*:ONBOARDING_TOUR"
[[ -z "${ACCOUNT_PORTAL_URL}" ]] && export ACCOUNT_PORTAL_URL=https://account.budibase.app
[[ -z "${REDIS_URL}" ]] && export REDIS_URL=localhost:6379
[[ -z "${SELF_HOSTED}" ]] && export SELF_HOSTED=1
[[ -z "${WORKER_PORT}" ]] && export WORKER_PORT=4002
[[ -z "${WORKER_URL}" ]] && export WORKER_URL=http://localhost:4002
[[ -z "${APPS_URL}" ]] && export APPS_URL=http://localhost:4001
[[ -z "${SERVER_TOP_LEVEL_PATH}" ]] && export SERVER_TOP_LEVEL_PATH=/app
#  export CUSTOM_DOMAIN=budi001.custom.com

# Azure App Service customisations
if [[ "${TARGETBUILD}" = "aas" ]]; then
    DATA_DIR=/home
    WEBSITES_ENABLE_APP_SERVICE_STORAGE=true
    /etc/init.d/ssh start
else
    DATA_DIR=${DATA_DIR:-/data}
fi
mkdir -p ${DATA_DIR}
# Mount NFS or GCP Filestore if env vars exist for it
if [[ ! -z ${FILESHARE_IP} && ! -z ${FILESHARE_NAME} ]]; then
    echo "Mounting NFS share"
    apt update && apt install -y nfs-common nfs-kernel-server
    echo "Mount file share ${FILESHARE_IP}:/${FILESHARE_NAME} to ${DATA_DIR}"
    mount -o nolock ${FILESHARE_IP}:/${FILESHARE_NAME} ${DATA_DIR}
    echo "Mounting result: $?"
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
mkdir -p ${DATA_DIR}/minio
chown -R couchdb:couchdb ${DATA_DIR}/couch
redis-server --requirepass $REDIS_PASSWORD > /dev/stdout 2>&1 &
/bbcouch-runner.sh &
/minio/minio server --console-address ":9001" ${DATA_DIR}/minio > /dev/stdout 2>&1 &
/etc/init.d/nginx restart
if [[ ! -z "${CUSTOM_DOMAIN}" ]]; then
    # Add monthly cron job to renew certbot certificate
    echo -n "* * 2 * * root exec /app/letsencrypt/certificate-renew.sh ${CUSTOM_DOMAIN}" >> /etc/cron.d/certificate-renew
    chmod +x /etc/cron.d/certificate-renew
    # Request the certbot certificate
    /app/letsencrypt/certificate-request.sh ${CUSTOM_DOMAIN}
    /etc/init.d/nginx restart
fi

# wait for backend services to start
sleep 10

pushd app
pm2 start -l /dev/stdout --name app "yarn run:docker"
popd
pushd worker
pm2 start -l /dev/stdout --name worker "yarn run:docker"
popd
echo "end of runner.sh, sleeping ..."
sleep infinity
