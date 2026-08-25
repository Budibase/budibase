#!/bin/bash

notify() {
    local service="$1"
    shift
    echo "$*"
    if [[ -w /proc/1/fd/1 ]]; then
        echo "${service}: $*" >/proc/1/fd/1
    fi
}

start_redis_server() {
    local cmd=("redis-server")

    if [[ -n "${REDIS_CONFIG}" ]]; then
        cmd=("redis-server" "${REDIS_CONFIG}")
    fi

    if [[ -n "${REDIS_PASSWORD}" ]]; then
        cmd+=("--requirepass" "${REDIS_PASSWORD}")
    fi

    if [[ -n "${REDIS_USERNAME}" && -n "${REDIS_PASSWORD}" ]]; then
        # Declaring a user without rules leaves it off, with no password and no
        # permissions, so clients authenticating as it are rejected with WRONGPASS.
        # Give it the same access the default user gets from requirepass.
        cmd+=("--user" "${REDIS_USERNAME}" "on" ">${REDIS_PASSWORD}" "allkeys" "allchannels" "allcommands")
    fi

    exec "${cmd[@]}"
}

litellm_cluster_exists() {
    [[ -f "$1/PG_VERSION" ]]
}

litellm_prepare_data_dir() {
    local dir="$1"
    mkdir -p "$dir" 2>/dev/null || return 1
    chown -R postgres:postgres "$dir" 2>/dev/null || true
    chmod 700 "$dir" 2>/dev/null || true
    [[ "$(stat -c "%a" "$dir" 2>/dev/null)" == "700" ]] || return 1
    su postgres -s /bin/bash -c "test -x \"${dir}\" && test -w \"${dir}\"" >/dev/null 2>&1
}

start_litellm_postgres() {
    set -eo pipefail

    local db_port="${LITELLM_DB_PORT:-5432}"
    local primary_data_dir="${LITELLM_PGDATA:-${DATA_DIR}/litellm/postgres}"
    local fallback_data_dir="${LITELLM_PGDATA_FALLBACK:-/var/lib/postgresql/budibase-litellm}"
    local bin_dir="${POSTGRES_BIN_DIR:-$(pg_config --bindir 2>/dev/null || true)}"

    if [[ -z "${bin_dir}" ]]; then
        echo "Unable to locate postgres binaries with pg_config."
        return 1
    fi

    local postgres_bin="${bin_dir}/postgres"
    local initdb_bin="${bin_dir}/initdb"

    if [[ ! -x "${postgres_bin}" || ! -x "${initdb_bin}" ]]; then
        echo "Postgres binaries are missing from ${bin_dir}."
        return 1
    fi

    local data_dir
    if litellm_cluster_exists "${primary_data_dir}"; then
        # An existing cluster is never relocated, even if its permissions look wrong.
        data_dir="${primary_data_dir}"
        litellm_prepare_data_dir "${data_dir}" || \
            notify litellm-postgres "Warning: ${data_dir} holds an existing cluster the postgres user may not be able to read."
    elif litellm_prepare_data_dir "${primary_data_dir}"; then
        data_dir="${primary_data_dir}"
    elif [[ -n "${LITELLM_PGDATA}" ]]; then
        notify litellm-postgres "LITELLM_PGDATA is set to ${LITELLM_PGDATA}, but the postgres user cannot use that directory."
        notify litellm-postgres "Point LITELLM_PGDATA at a path postgres can own with mode 700, or set LITELLM_INTERNAL_DB=false and supply DATABASE_URL."
        return 1
    elif litellm_prepare_data_dir "${fallback_data_dir}" || litellm_cluster_exists "${fallback_data_dir}"; then
        data_dir="${fallback_data_dir}"
        notify litellm-postgres "Warning: ${primary_data_dir} cannot be used by the postgres user. The volume may ignore chown/chmod, or restrict the postgres uid with ACLs."
        notify litellm-postgres "Warning: falling back to ${fallback_data_dir}, which lives in the container and is lost when the container is recreated."
        notify litellm-postgres "Warning: set LITELLM_PGDATA to a usable path, or LITELLM_INTERNAL_DB=false with DATABASE_URL, to persist LiteLLM data."
    else
        notify litellm-postgres "Unable to prepare a postgres data directory for LiteLLM. Tried ${primary_data_dir} and ${fallback_data_dir}."
        return 1
    fi

    notify litellm-postgres "Using postgres data directory ${data_dir} for LiteLLM."

    if ! litellm_cluster_exists "${data_dir}"; then
        echo "Initializing LiteLLM postgres data directory at ${data_dir}..."
        su postgres -s /bin/bash -c "\"${initdb_bin}\" -D \"${data_dir}\" --auth-local=trust --auth-host=scram-sha-256"
    fi

    local postgres_config="${data_dir}/postgresql.conf"
    local postgres_hba="${data_dir}/pg_hba.conf"

    if grep -qE "^#?listen_addresses\\s*=" "${postgres_config}"; then
        sed -i "s/^#\\?listen_addresses\\s*=.*/listen_addresses = '127.0.0.1'/" "${postgres_config}"
    else
        echo "listen_addresses = '127.0.0.1'" >> "${postgres_config}"
    fi

    if grep -qE "^#?port\\s*=" "${postgres_config}"; then
        sed -i "s/^#\\?port\\s*=.*/port = ${db_port}/" "${postgres_config}"
    else
        echo "port = ${db_port}" >> "${postgres_config}"
    fi

    if ! grep -qE "^host\\s+all\\s+all\\s+127\\.0\\.0\\.1/32\\s+scram-sha-256" "${postgres_hba}"; then
        echo "host all all 127.0.0.1/32 scram-sha-256" >> "${postgres_hba}"
    fi

    echo "Starting postgres for LiteLLM on 127.0.0.1:${db_port}..."
    exec su postgres -s /bin/bash -c "\"${postgres_bin}\" -D \"${data_dir}\" -p \"${db_port}\" -h 127.0.0.1"
}

case "${1:-}" in
    redis-server)
        start_redis_server
        exit $?
        ;;
    litellm-postgres)
        start_litellm_postgres
        exit $?
        ;;
esac

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
export PROXY_REAL_IP_FROM="${PROXY_REAL_IP_FROM:-127.0.0.1}"

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

sync_couch_env_aliases() {
    if [[ -z "${COUCH_DB_USER}" && -n "${COUCHDB_USER}" ]]; then
        export COUCH_DB_USER="${COUCHDB_USER}"
    elif [[ -z "${COUCHDB_USER}" && -n "${COUCH_DB_USER}" ]]; then
        export COUCHDB_USER="${COUCH_DB_USER}"
    fi

    if [[ -z "${COUCH_DB_PASSWORD}" && -n "${COUCHDB_PASSWORD}" ]]; then
        export COUCH_DB_PASSWORD="${COUCHDB_PASSWORD}"
    elif [[ -z "${COUCHDB_PASSWORD}" && -n "${COUCH_DB_PASSWORD}" ]]; then
        export COUCHDB_PASSWORD="${COUCH_DB_PASSWORD}"
    fi
}

repair_internal_couch_url() {
    local internal_url="http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@127.0.0.1:5984"
    local auth

    sync_couch_env_aliases

    if [[ -z "${COUCH_DB_URL}" ]]; then
        export COUCH_DB_URL="${internal_url}"
        return
    fi

    if [[ "${COUCH_DB_URL}" == *'$COUCH'* || "${COUCH_DB_URL}" == *'${COUCH'* ]]; then
        export COUCH_DB_URL="${internal_url}"
        return
    fi

    if [[ "${COUCH_DB_URL}" =~ ^https?://([^@]*)@ ]]; then
        auth="${BASH_REMATCH[1]}"
        if [[ "${auth}" != "${COUCHDB_USER}:${COUCHDB_PASSWORD}" ]]; then
            export COUCH_DB_URL="${internal_url}"
        fi
    fi
}

# Custom CA bundle support.
# Mount the file at one of these paths:
#   - ${DATA_DIR}/ca-bundle.pem
#   - /etc/budibase/ca-bundle.pem
# Or set CUSTOM_CA_BUNDLE_PATH to an explicit absolute path.
CUSTOM_CA_BUNDLE_PATH="${CUSTOM_CA_BUNDLE_PATH:-}"
if [[ -z "${CUSTOM_CA_BUNDLE_PATH}" ]]; then
    for candidate in "${DATA_DIR}/ca-bundle.pem" "/etc/budibase/ca-bundle.pem"; do
        if [[ -f "${candidate}" ]]; then
            CUSTOM_CA_BUNDLE_PATH="${candidate}"
            break
        fi
    done
fi
if [[ -n "${CUSTOM_CA_BUNDLE_PATH}" && -f "${CUSTOM_CA_BUNDLE_PATH}" ]]; then
    echo "Installing custom CA bundle from ${CUSTOM_CA_BUNDLE_PATH}"
    install -m 0644 "${CUSTOM_CA_BUNDLE_PATH}" /usr/local/share/ca-certificates/budibase-custom.crt
    update-ca-certificates >/dev/null 2>&1 || echo "Warning: update-ca-certificates failed"
    export NODE_EXTRA_CA_CERTS="${CUSTOM_CA_BUNDLE_PATH}"
fi

# Mount NFS or GCP Filestore if FILESHARE_IP and FILESHARE_NAME are set
if [[ -n "${FILESHARE_IP}" && -n "${FILESHARE_NAME}" ]]; then
    echo "Mounting NFS share"
    apt update && apt install -y nfs-common nfs-kernel-server
    echo "Mount file share ${FILESHARE_IP}:/${FILESHARE_NAME} to ${DATA_DIR}"
    mount -o nolock "${FILESHARE_IP}:/${FILESHARE_NAME}" "${DATA_DIR}"
    echo "Mounting result: $?"
fi

# Preserve runtime LiteLLM DB settings so they are not overridden by persisted .env values.
runtime_database_url_set="false"
runtime_litellm_internal_db_set="false"
if [[ "${DATABASE_URL+x}" == "x" ]]; then
    runtime_database_url_set="true"
    runtime_database_url="${DATABASE_URL}"
fi
if [[ "${LITELLM_INTERNAL_DB+x}" == "x" ]]; then
    runtime_litellm_internal_db_set="true"
    runtime_litellm_internal_db="${LITELLM_INTERNAL_DB}"
fi

# These are randomized if unset and persisted to .env.
env_vars=(COUCHDB_USER COUCHDB_PASSWORD MINIO_ACCESS_KEY MINIO_SECRET_KEY INTERNAL_API_KEY JWT_SECRET REDIS_PASSWORD LITELLM_MASTER_KEY LITELLM_SALT_KEY LITELLM_DB_PASSWORD)

declare -A runtime_secret_values
for var in "${env_vars[@]}"; do
    if [[ -n "${!var}" ]]; then
        runtime_secret_values["$var"]="${!var}"
    fi
done

# Source environment variables from a .env file if it exists in DATA_DIR
if [[ -f "${DATA_DIR}/.env" ]]; then
    set -a  # Automatically export all variables loaded from .env
    source "${DATA_DIR}/.env"
    set +a
fi

# Sync aliases before randomizing to avoid overwriting user-provided underscore vars.
sync_couch_env_aliases

# Randomize any unset sensitive environment variables using uuidgen
generated_vars=()
for var in "${env_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        export "$var"="$(uuidgen | tr -d '-')"
        generated_vars+=("$var")
    fi
done

# If ${DATA_DIR}/.env did not exist on this start, we just minted fresh
# secrets. When ${DATA_DIR} is not backed by a persistent volume, those
# secrets are regenerated on every restart, which invalidates JWTs,
# encrypted session payloads and the redis AUTH password — the common
# symptom is a flood of "Auth Error: Session not found" and 403
# Unauthorized in the logs after the container restarts. Make this loud
# so operators notice before they put the deployment in front of users.
if [[ ! -f "${DATA_DIR}/.env" && "${#generated_vars[@]}" -gt 0 && "${BUDIBASE_ACK_EPHEMERAL_DATA:-0}" != "1" ]]; then
    cat <<EOF >&2
==============================================================================
WARNING: ${DATA_DIR}/.env did not exist; generated fresh secrets for:
  ${generated_vars[*]}

If ${DATA_DIR} is NOT a persistent volume, these secrets will be regenerated
on every container restart. That will:
  - log every existing user out (Session not found / 403 Unauthorized)
  - re-encrypt CouchDB/Redis credentials, breaking persisted data
  - rotate JWT_SECRET, invalidating all signed tokens

Mount a persistent volume at ${DATA_DIR} (docker -v / k8s PVC) BEFORE
putting this container into production. Set BUDIBASE_ACK_EPHEMERAL_DATA=1
to silence this warning.
==============================================================================
EOF
fi

repair_internal_couch_url

if [[ -z "${COUCH_DB_SQL_URL}" ]]; then
    export COUCH_DB_SQL_URL=http://127.0.0.1:4984
fi

if [ ! -f "${DATA_DIR}/.env" ]; then
    touch ${DATA_DIR}/.env
    for ENV_VAR in "${env_vars[@]}"; do
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

# Set or replace a variable in the persisted .env, overwriting any existing value.
upsert_env_var() {
    local name="$1"
    local value="$2"
    local env_file="${DATA_DIR}/.env"
    local temp_file
    temp_file="$(mktemp)"

    awk -v name="$name" -v value="$value" '
index($0, name "=") == 1 {
    if (!updated) {
        print name "=" value
        updated = 1
    }
    next
}
{
    print
}
END {
    if (!updated) {
        print name "=" value
    }
}
' "${env_file}" > "${temp_file}"

    mv "${temp_file}" "${env_file}"
}

ensure_env_var "LITELLM_DB_NAME" "${LITELLM_DB_NAME}"
ensure_env_var "LITELLM_DB_USER" "${LITELLM_DB_USER}"
ensure_env_var "LITELLM_DB_PASSWORD" "${LITELLM_DB_PASSWORD}"
ensure_env_var "LITELLM_DB_PORT" "${LITELLM_DB_PORT}"
ensure_env_var "LITELLM_MASTER_KEY" "${LITELLM_MASTER_KEY}"
ensure_env_var "LITELLM_SALT_KEY" "${LITELLM_SALT_KEY}"

# Read in the .env file and export the variables
for LINE in $(cat ${DATA_DIR}/.env); do export $LINE; done
repair_internal_couch_url

# Runtime values should take precedence over persisted .env values.
if [[ "${runtime_database_url_set}" == "true" ]]; then
    export DATABASE_URL="${runtime_database_url}"
fi
if [[ "${runtime_litellm_internal_db_set}" == "true" ]]; then
    export LITELLM_INTERNAL_DB="${runtime_litellm_internal_db}"
fi

# A runtime-provided secret only overrides the persisted value when it actually
# differs from it. This lets users rotate any secret by passing a new value on a
# later boot, while ignoring image-baked defaults (e.g. the base image always sets
# COUCHDB_USER/PASSWORD) that already match what is persisted.
couch_creds_updated="false"
for var in "${!runtime_secret_values[@]}"; do
    if [[ "${runtime_secret_values[$var]}" == "${!var}" ]]; then
        continue
    fi
    export "$var"="${runtime_secret_values[$var]}"
    upsert_env_var "$var" "${runtime_secret_values[$var]}"
    if [[ "$var" == "COUCHDB_USER" || "$var" == "COUCHDB_PASSWORD" ]]; then
        couch_creds_updated="true"
    fi
done

# If the CouchDB credentials changed, rebuild and persist the derived internal URL.
if [[ "${couch_creds_updated}" == "true" ]]; then
    sync_couch_env_aliases
    repair_internal_couch_url
    upsert_env_var "COUCH_DB_URL" "${COUCH_DB_URL}"
fi

ln -sfn ${DATA_DIR}/.env /app/.env
ln -sfn ${DATA_DIR}/.env /worker/.env

# Make these directories in runner, incase of mount
mkdir -p ${DATA_DIR}/minio
mkdir -p ${DATA_DIR}/redis
mkdir -p ${DATA_DIR}/couch
mkdir -p ${DATA_DIR}/litellm
mkdir -p ${DATA_DIR}/litellm/postgres
chown -R couchdb:couchdb ${DATA_DIR}/couch
chown -R postgres:postgres ${DATA_DIR}/litellm
chmod 700 ${DATA_DIR}/litellm/postgres

echo "Starting Redis runner..."
using_default_redis_config="false"
if [[ -z "${REDIS_CONFIG}" ]]; then
    REDIS_CONFIG="/etc/redis/redis.conf"
    using_default_redis_config="true"
fi

if [[ -n "${REDIS_CONFIG}" && -f "${REDIS_CONFIG}" ]]; then
    escaped_data_dir="$(printf '%s\n' "${DATA_DIR}" | sed 's/[\\&#]/\\&/g')"
    sed -i "s#DATA_DIR#${escaped_data_dir}#g" "${REDIS_CONFIG}"
fi

if [[ -n "${USE_DEFAULT_REDIS_CONFIG}" ]]; then
    unset REDIS_CONFIG
elif [[ "${using_default_redis_config}" == "true" && ! -w "${DATA_DIR}/redis" ]]; then
    echo "Warning: ${DATA_DIR}/redis is not writable, starting redis with its built-in defaults. Cached data will not persist."
    unset REDIS_CONFIG
else
    export REDIS_CONFIG
fi

echo "Starting redis-server with pm2..."
pm2 start ./runner.sh --name redis-server --interpreter bash -- redis-server

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

# one set_real_ip_from per CIDR, which envsubst cannot express
: > /etc/nginx/real-ip.conf
for cidr in $(printf '%s' "${PROXY_REAL_IP_FROM}" | tr ',;' '  '); do
  case "${cidr}" in
    0.0.0.0/0 | ::/0 | any)
      echo "PROXY_REAL_IP_FROM must not contain ${cidr}: it would trust X-Forwarded-For from every client, making rate limiting and login lockout trivially spoofable. List your load balancer's CIDRs instead."
      exit 1
      ;;
  esac
  echo "set_real_ip_from ${cidr};" >> /etc/nginx/real-ip.conf
done

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

litellm_db_ready="true"

if [[ "${LITELLM_INTERNAL_DB}" == "true" ]]; then
    echo "Starting internal LiteLLM postgres runner..."
    pm2 start ./runner.sh --name litellm-postgres --interpreter bash --restart-delay 5000 -- litellm-postgres

    echo "Waiting for internal LiteLLM postgres to become ready..."
    litellm_db_timeout="${LITELLM_DB_READY_TIMEOUT_SECONDS:-60}"
    litellm_db_ready="false"
    postgres_wait_seconds=0
    while true; do
        if pg_isready -p "${LITELLM_DB_PORT}" -U postgres >/dev/null 2>&1; then
            litellm_db_ready="true"
            break
        fi
        postgres_wait_seconds=$((postgres_wait_seconds + 1))
        if [[ "${postgres_wait_seconds}" -ge "${litellm_db_timeout}" ]]; then
            break
        fi
        sleep 1
    done
fi

if [[ "${LITELLM_INTERNAL_DB}" == "true" && "${litellm_db_ready}" == "false" ]]; then
    echo "Timed out waiting for internal LiteLLM postgres to start after ${litellm_db_timeout}s."
    echo "--- litellm-postgres log ---"
    pm2 logs litellm-postgres --lines 50 --nostream 2>&1 | tail -60
    echo "--- end litellm-postgres log ---"
    echo "Continuing startup without LiteLLM. AI features will be unavailable until the container is restarted."
fi

if [[ "${LITELLM_INTERNAL_DB}" == "true" && "${litellm_db_ready}" == "true" ]]; then
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

export USE_PRISMA_MIGRATE="True"

upsert_env_var "LITELLM_INTERNAL_DB" "${LITELLM_INTERNAL_DB}"
upsert_env_var "DATABASE_URL" "${DATABASE_URL}"
upsert_env_var "COUCH_DB_URL" "${COUCH_DB_URL}"

# Wait for backend services to start
sleep 10

litellm_ready="false"
if [[ "${litellm_db_ready}" != "true" ]]; then
    echo "Skipping LiteLLM startup, its metadata database is unavailable. App and worker will still start."
else
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

    echo "Waiting for LiteLLM to become ready..."
    litellm_ready_timeout="${LITELLM_READY_TIMEOUT_SECONDS:-120}"
    litellm_wait_seconds=0
    until [[ $(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/health/liveliness) -eq 200 ]]; do
        litellm_wait_seconds=$((litellm_wait_seconds + 1))
        if [[ "${litellm_wait_seconds}" -ge "${litellm_ready_timeout}" ]]; then
            echo "Timed out waiting for LiteLLM readiness after ${litellm_ready_timeout}s. Continuing startup without waiting further."
            break
        fi
        sleep 1
    done
    if [[ $(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/health/liveliness) -eq 200 ]]; then
        litellm_ready="true"
    fi
    if [[ "${litellm_ready}" == "true" ]]; then
        echo "LiteLLM is ready."
    else
        echo "LiteLLM is not ready yet. App and worker will still start."
    fi
fi

pushd app
pm2 start --name app "yarn run:docker"
popd
pushd worker
pm2 start --name worker "yarn run:docker"
popd

echo "end of runner.sh, sleeping ..."

tail -f $HOME/.pm2/logs/*.log
sleep infinity
