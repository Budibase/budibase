#!/bin/bash

echo "Starting runner.sh..."

# Set defaults for Docker-related variables
export APP_PORT="${APP_PORT:-4001}"
export ARCHITECTURE="${ARCHITECTURE:-amd}"
export BUDIBASE_ENVIRONMENT="${BUDIBASE_ENVIRONMENT:-PRODUCTION}"
export CLUSTER_PORT="${CLUSTER_PORT:-80}"
export DEPLOYMENT_ENVIRONMENT="${DEPLOYMENT_ENVIRONMENT:-docker}"
export LITELLM_DB_NAME="${LITELLM_DB_NAME:-litellm}"
export LITELLM_DB_USER="${LITELLM_DB_USER:-llmproxy}"
export LITELLM_DB_PORT="${LITELLM_DB_PORT:-5432}"

# Set defaults for proxy rate limiting (matching production defaults)
export PROXY_RATE_LIMIT_API_PER_SECOND="${PROXY_RATE_LIMIT_API_PER_SECOND:-50}"
export PROXY_RATE_LIMIT_WEBHOOKS_PER_SECOND="${PROXY_RATE_LIMIT_WEBHOOKS_PER_SECOND:-10}"

# Only set MINIO_URL if neither MINIO_URL nor USE_S3 is set
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

# Set DATA_DIR and ensure the directory exists
if [[ ${TARGETBUILD} == "aas" ]]; then
    export DATA_DIR="/home"
else
    export DATA_DIR="${DATA_DIR:-/data}"
fi
mkdir -p "${DATA_DIR}"

# Mount NFS or GCP Filestore if FILESHARE_IP and FILESHARE_NAME are set
if [[ -n "${FILESHARE_IP}" && -n "${FILESHARE_NAME}" ]]; then
    echo "Mounting NFS share"
    apt update && apt install -y nfs-common nfs-kernel-server
    echo "Mount file share ${FILESHARE_IP}:/${FILESHARE_NAME} to ${DATA_DIR}"
    mount -o nolock "${FILESHARE_IP}:/${FILESHARE_NAME}" "${DATA_DIR}"
    echo "Mounting result: $?"
fi

# Source environment variables from a .env file if it exists in DATA_DIR
if [[ -f "${DATA_DIR}/.env" ]]; then
    set -a  # Automatically export all variables loaded from .env
    source "${DATA_DIR}/.env"
    set +a
fi

# Randomize any unset sensitive environment variables using uuidgen
env_vars=(COUCHDB_USER COUCHDB_PASSWORD MINIO_ACCESS_KEY MINIO_SECRET_KEY INTERNAL_API_KEY JWT_SECRET REDIS_PASSWORD LITELLM_DB_PASSWORD)
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

ensure_env_var() {
    local name="$1"
    local value="$2"
    if grep -q "^${name}=" "${DATA_DIR}/.env"; then
        return
    fi
    echo "${name}=${value}" >> "${DATA_DIR}/.env"
}

ensure_env_var "LITELLM_DB_NAME" "${LITELLM_DB_NAME}"
ensure_env_var "LITELLM_DB_USER" "${LITELLM_DB_USER}"
ensure_env_var "LITELLM_DB_PASSWORD" "${LITELLM_DB_PASSWORD}"
ensure_env_var "LITELLM_DB_PORT" "${LITELLM_DB_PORT}"

# Read in the .env file and export the variables
for LINE in $(cat ${DATA_DIR}/.env); do export $LINE; done
ln -s ${DATA_DIR}/.env /app/.env
ln -s ${DATA_DIR}/.env /worker/.env

# Make these directories in runner, incase of mount
mkdir -p ${DATA_DIR}/minio
mkdir -p ${DATA_DIR}/redis
mkdir -p ${DATA_DIR}/couch
mkdir -p ${DATA_DIR}/litellm
chown -R couchdb:couchdb ${DATA_DIR}/couch
chown -R postgres:postgres ${DATA_DIR}/litellm

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

echo "Processing nginx configuration templates..."
envsubst '${PROXY_RATE_LIMIT_API_PER_SECOND} ${PROXY_RATE_LIMIT_WEBHOOKS_PER_SECOND}' < /etc/nginx/nginx.conf > /tmp/nginx.conf && mv /tmp/nginx.conf /etc/nginx/nginx.conf

/etc/init.d/nginx restart
if [[ ! -z "${CUSTOM_DOMAIN}" ]]; then
    # Add monthly cron job to renew certbot certificate
    echo -n "* * 2 * * root exec /app/letsencrypt/certificate-renew.sh ${CUSTOM_DOMAIN}" >>/etc/cron.d/certificate-renew
    chmod +x /etc/cron.d/certificate-renew
    # Request the certbot certificate
    /app/letsencrypt/certificate-request.sh ${CUSTOM_DOMAIN}
    /etc/init.d/nginx restart
fi

if [[ -z "${LITELLM_INTERNAL_DB}" ]]; then
    if [[ -z "${DATABASE_URL}" ]]; then
        export LITELLM_INTERNAL_DB="true"
    else
        export LITELLM_INTERNAL_DB="false"
    fi
fi

if [[ "${LITELLM_INTERNAL_DB}" == "true" && -z "${DATABASE_URL}" ]]; then
    export DATABASE_URL="postgresql://${LITELLM_DB_USER}:${LITELLM_DB_PASSWORD}@127.0.0.1:${LITELLM_DB_PORT}/${LITELLM_DB_NAME}"
fi

if [[ "${LITELLM_INTERNAL_DB}" == "true" ]]; then
    echo "Starting internal LiteLLM postgres runner..."
    pm2 start ./litellm-db-runner.sh --name litellm-postgres --interpreter bash

    echo "Waiting for internal LiteLLM postgres to become ready..."
    postgres_wait_seconds=0
    until pg_isready -p "${LITELLM_DB_PORT}" -U postgres >/dev/null 2>&1; do
        postgres_wait_seconds=$((postgres_wait_seconds + 1))
        if [[ "${postgres_wait_seconds}" -ge 60 ]]; then
            echo "Timed out waiting for internal LiteLLM postgres to start."
            exit 1
        fi
        sleep 1
    done

    psql \
      -v ON_ERROR_STOP=1 \
      --set=bb_user="${LITELLM_DB_USER}" \
      --set=bb_pass="${LITELLM_DB_PASSWORD}" \
      --set=bb_db="${LITELLM_DB_NAME}" \
      -p "${LITELLM_DB_PORT}" \
      -U postgres \
      postgres <<'SQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'bb_user', :'bb_pass')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'bb_user')\gexec
SELECT format('ALTER ROLE %I LOGIN PASSWORD %L', :'bb_user', :'bb_pass')\gexec
SELECT format('CREATE DATABASE %I OWNER %I', :'bb_db', :'bb_user')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'bb_db')\gexec
SELECT format('GRANT ALL PRIVILEGES ON DATABASE %I TO %I', :'bb_db', :'bb_user')\gexec
SQL
fi

if [[ -z "${DATABASE_URL}" ]]; then
    echo "LiteLLM requires DATABASE_URL. Set DATABASE_URL or keep LITELLM_INTERNAL_DB=true."
    exit 1
fi

if [[ -z "${LITELLM_MASTER_KEY}" || -z "${LITELLM_SALT_KEY}" ]]; then
    echo "LiteLLM requires both LITELLM_MASTER_KEY and LITELLM_SALT_KEY."
    exit 1
fi

ensure_env_var "LITELLM_INTERNAL_DB" "${LITELLM_INTERNAL_DB}"
ensure_env_var "DATABASE_URL" "${DATABASE_URL}"

# Wait for backend services to start
sleep 10

LITELLM_CONFIG_PATH="/litellm/config.yaml"
if [ -f "${DATA_DIR}/litellm/config.yaml" ]; then
    echo "Using user-mounted litellm config from ${DATA_DIR}/litellm/config.yaml"
    LITELLM_CONFIG_PATH="${DATA_DIR}/litellm/config.yaml"
fi

pm2 start /opt/venv/litellm/bin/litellm \
  --name litellm \
  --interpreter /opt/venv/litellm/bin/python \
  --restart-delay 5000 \
  --time \
  -- -c "${LITELLM_CONFIG_PATH}"

pushd app
pm2 start --name app "yarn run:docker"
popd
pushd worker
pm2 start --name worker "yarn run:docker"
popd

echo "end of runner.sh, sleeping ..."

tail -f $HOME/.pm2/logs/*.log
sleep infinity
