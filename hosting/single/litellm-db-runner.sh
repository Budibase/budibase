#!/bin/bash
set -eo pipefail

LITELLM_DB_PORT="${LITELLM_DB_PORT:-5432}"
POSTGRES_DATA_DIR="${LITELLM_PGDATA:-${DATA_DIR}/litellm/postgres}"
POSTGRES_BIN_DIR="${POSTGRES_BIN_DIR:-$(pg_config --bindir 2>/dev/null || true)}"

if [[ -z "${POSTGRES_BIN_DIR}" ]]; then
    echo "Unable to locate postgres binaries with pg_config."
    exit 1
fi

POSTGRES_BIN="${POSTGRES_BIN_DIR}/postgres"
INITDB_BIN="${POSTGRES_BIN_DIR}/initdb"

if [[ ! -x "${POSTGRES_BIN}" || ! -x "${INITDB_BIN}" ]]; then
    echo "Postgres binaries are missing from ${POSTGRES_BIN_DIR}."
    exit 1
fi

mkdir -p "${POSTGRES_DATA_DIR}"
chown -R postgres:postgres "${POSTGRES_DATA_DIR}"

if [[ ! -f "${POSTGRES_DATA_DIR}/PG_VERSION" ]]; then
    echo "Initializing LiteLLM postgres data directory at ${POSTGRES_DATA_DIR}..."
    su postgres -s /bin/bash -c "\"${INITDB_BIN}\" -D \"${POSTGRES_DATA_DIR}\" --auth-local=trust --auth-host=scram-sha-256"
fi

POSTGRES_CONFIG="${POSTGRES_DATA_DIR}/postgresql.conf"
POSTGRES_HBA="${POSTGRES_DATA_DIR}/pg_hba.conf"

if grep -qE "^#?listen_addresses\\s*=" "${POSTGRES_CONFIG}"; then
    sed -i "s/^#\\?listen_addresses\\s*=.*/listen_addresses = '127.0.0.1'/" "${POSTGRES_CONFIG}"
else
    echo "listen_addresses = '127.0.0.1'" >> "${POSTGRES_CONFIG}"
fi

if grep -qE "^#?port\\s*=" "${POSTGRES_CONFIG}"; then
    sed -i "s/^#\\?port\\s*=.*/port = ${LITELLM_DB_PORT}/" "${POSTGRES_CONFIG}"
else
    echo "port = ${LITELLM_DB_PORT}" >> "${POSTGRES_CONFIG}"
fi

if ! grep -qE "^host\\s+all\\s+all\\s+127\\.0\\.0\\.1/32\\s+scram-sha-256" "${POSTGRES_HBA}"; then
    echo "host all all 127.0.0.1/32 scram-sha-256" >> "${POSTGRES_HBA}"
fi

echo "Starting postgres for LiteLLM on 127.0.0.1:${LITELLM_DB_PORT}..."
exec su postgres -s /bin/bash -c "\"${POSTGRES_BIN}\" -D \"${POSTGRES_DATA_DIR}\" -p \"${LITELLM_DB_PORT}\" -h 127.0.0.1"
