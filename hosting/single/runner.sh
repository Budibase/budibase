#!/bin/bash

echo "Starting runner.sh..."

# set defaults for Docker-related variables
export APP_PORT="${APP_PORT:-4001}"
export ARCHITECTURE="${ARCHITECTURE:-amd}"
export BUDIBASE_ENVIRONMENT="${BUDIBASE_ENVIRONMENT:-PRODUCTION}"
export CLUSTER_PORT="${CLUSTER_PORT:-80}"
export DEPLOYMENT_ENVIRONMENT="${DEPLOYMENT_ENVIRONMENT:-docker}"

# only set MINIO_URL if neither MINIO_URL nor USE_S3 is set
if [[ -z "${MINIO_URL}" && -z "${USE_S3}" ]]; then
  export MINIO_URL="http://127.0.0.1:9000"
fi

export NODE_ENV="${NODE_ENV:-production}"
export POSTHOG_TOKEN="${POSTHOG_TOKEN:-phc_bIjZL7oh2GEUd2vqvTBH8WvrX0fWTFQMs6H5KQxiUxU}"
export ACCOUNT_PORTAL_URL="${ACCOUNT_PORTAL_URL:-https://account.budibase.app}"
export REDIS_URL="${REDIS_URL:-127.0.0.1:6379}"
export SELF_HOSTED="${SELF_HOSTED:-1}"
export WORKER_PORT="${WORKER_PORT:-4002}"
export WORKER_URL="${WORKER_URL:-http://127.0.0.1:4002}"
export APPS_URL="${APPS_URL:-http://127.0.0.1:4001}"
export SERVER_TOP_LEVEL_PATH="${SERVER_TOP_LEVEL_PATH:-/app}"

# set DATA_DIR and ensure the directory exists
if [[ ${TARGETBUILD} == "aas" ]]; then
    export DATA_DIR="/home"
else
    export DATA_DIR="${DATA_DIR:-/data}"
fi
mkdir -p "${DATA_DIR}"

# mount NFS or GCP Filestore if FILESHARE_IP and FILESHARE_NAME are set
if [[ -n "${FILESHARE_IP}" && -n "${FILESHARE_NAME}" ]]; then
    echo "Mounting NFS share"
    apt update && apt install -y nfs-common nfs-kernel-server
    echo "Mount file share ${FILESHARE_IP}:/${FILESHARE_NAME} to ${DATA_DIR}"
    mount -o nolock "${FILESHARE_IP}:/${FILESHARE_NAME}" "${DATA_DIR}"
    echo "Mounting result: $?"
fi

# source environment variables from a .env file if it exists in DATA_DIR
if [[ -f "${DATA_DIR}/.env" ]]; then
    set -a  # Automatically export all variables loaded from .env
    source "${DATA_DIR}/.env"
    set +a
fi

# randomize any unset sensitive environment variables using uuidgen
env_vars=(COUCHDB_USER COUCHDB_PASSWORD MINIO_ACCESS_KEY MINIO_SECRET_KEY INTERNAL_API_KEY JWT_SECRET REDIS_PASSWORD)
for var in "${env_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        export "$var"="$(uuidgen | tr -d '-')"
    fi
done

if [[ -z "${COUCH_DB_URL}" ]]; then
    export COUCH_DB_URL=http://$COUCHDB_USER:$COUCHDB_PASSWORD@127.0.0.1:5984
fi

if [[ -z "${COUCH_DB_SQL_URL}" ]]; then
    export COUCH_DB_SQL_URL=http://127.0.0.1:4984
fi

if [ ! -f "${DATA_DIR}/.env" ]; then
    touch ${DATA_DIR}/.env
    for ENV_VAR in "${ENV_VARS[@]}"; do
        temp=$(eval "echo \$$ENV_VAR")
        echo "$ENV_VAR=$temp" >>${DATA_DIR}/.env
    done
    for ENV_VAR in "${DOCKER_VARS[@]}"; do
        temp=$(eval "echo \$$ENV_VAR")
        echo "$ENV_VAR=$temp" >>${DATA_DIR}/.env
    done
    echo "COUCH_DB_URL=${COUCH_DB_URL}" >>${DATA_DIR}/.env
fi

# Read in the .env file and export the variables
for LINE in $(cat ${DATA_DIR}/.env); do export $LINE; done
ln -s ${DATA_DIR}/.env /app/.env
ln -s ${DATA_DIR}/.env /worker/.env

# make these directories in runner, incase of mount
mkdir -p ${DATA_DIR}/minio
mkdir -p ${DATA_DIR}/redis
mkdir -p ${DATA_DIR}/couch
chown -R couchdb:couchdb ${DATA_DIR}/couch

echo "Starting Redis runner..."
./redis-runner.sh &

echo "Starting callback CouchDB runner..."
./bbcouch-runner.sh &

# only start minio if use s3 isn't passed
if [[ -z "${USE_S3}" ]]; then
    if [[ ${TARGETBUILD} == aas ]]; then
        echo "Starting MinIO in Azure Gateway mode"
        if [[ -z "${AZURE_STORAGE_ACCOUNT}" || -z "${AZURE_STORAGE_KEY}" || -z "${MINIO_ACCESS_KEY}" || -z "${MINIO_SECRET_KEY}" ]]; then
            echo "The following environment variables must be set: AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_KEY, MINIO_ACCESS_KEY, MINIO_SECRET_KEY"
            exit 1
        fi
        /minio/minio gateway azure --console-address ":9001" >/dev/stdout 2>&1 &
    else
        echo "Starting MinIO in standalone mode"
        /minio/minio server --console-address ":9001" ${DATA_DIR}/minio >/dev/stdout 2>&1 &
    fi
fi

/etc/init.d/nginx restart
if [[ ! -z "${CUSTOM_DOMAIN}" ]]; then
    # Add monthly cron job to renew certbot certificate
    echo -n "* * 2 * * root exec /app/letsencrypt/certificate-renew.sh ${CUSTOM_DOMAIN}" >>/etc/cron.d/certificate-renew
    chmod +x /etc/cron.d/certificate-renew
    # Request the certbot certificate
    /app/letsencrypt/certificate-request.sh ${CUSTOM_DOMAIN}
    /etc/init.d/nginx restart
fi

# wait for backend services to start
sleep 10

pushd app
pm2 start --name app "yarn run:docker"
popd
pushd worker
pm2 start --name worker "yarn run:docker"
popd
echo "end of runner.sh, sleeping ..."

tail -f $HOME/.pm2/logs/*.log
sleep infinity
