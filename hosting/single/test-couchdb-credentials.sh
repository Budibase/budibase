#!/usr/bin/env bash
set -euo pipefail

patched_image="${1:?Usage: test-couchdb-credentials.sh PATCHED_IMAGE VULNERABLE_IMAGE}"
vulnerable_image="${2:?Usage: test-couchdb-credentials.sh PATCHED_IMAGE VULNERABLE_IMAGE}"
suffix="$(uuidgen | tr -d '-' | cut -c1-12)"
container="bb-couch-credentials-${suffix}"
fresh_volume="bb-couch-fresh-${suffix}"
upgrade_volume="bb-couch-upgrade-${suffix}"
override_volume="bb-couch-override-${suffix}"

cleanup() {
    docker rm -f "${container}" >/dev/null 2>&1 || true
    docker volume rm "${fresh_volume}" "${upgrade_volume}" "${override_volume}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

start_image() {
    local image="$1" volume="$2"
    shift 2
    docker run -d --name "${container}" -p 127.0.0.1::80 \
        -v "${volume}:/data" "$@" "${image}" >/dev/null
    local port
    port="$(docker port "${container}" 80/tcp | sed 's/.*://')"
    base_url="http://127.0.0.1:${port}"
    for _ in $(seq 1 120); do
        if [[ "$(curl -s -o /dev/null -w '%{http_code}' "${base_url}/db/_up")" == "200" ]]; then
            return
        fi
        sleep 2
    done
    echo "CouchDB did not start in ${container}" >&2
    exit 1
}

stop_image() {
    docker rm -f "${container}" >/dev/null
}

wait_health() {
    for _ in $(seq 1 120); do
        if [[ "$(curl -s -o /dev/null -w '%{http_code}' "${base_url}/health")" == "200" ]]; then
            return
        fi
        sleep 2
    done
    echo "Budibase did not become healthy in ${container}" >&2
    exit 1
}

assert_default_admin_status() {
    local expected="$1" actual
    actual="$(curl -s -o /dev/null -w '%{http_code}' -u admin:admin "${base_url}/db/_all_dbs")"
    [[ "${actual}" == "${expected}" ]] || {
        echo "Expected admin/admin to return ${expected}, got ${actual}" >&2
        exit 1
    }
}

assert_generated_admin_works() {
    docker exec "${container}" bash -lc '
        source /data/.env
        [[ "$COUCHDB_USER" != admin && "$COUCHDB_PASSWORD" != admin ]] || exit 1
        [[ "$(curl -s -o /dev/null -w "%{http_code}" -u "$COUCHDB_USER:$COUCHDB_PASSWORD" http://127.0.0.1:5984/_all_dbs)" == 200 ]]
    '
}

start_image "${vulnerable_image}" "${upgrade_volume}"
assert_default_admin_status 200
stop_image

start_image "${patched_image}" "${upgrade_volume}"
wait_health
assert_default_admin_status 401
assert_generated_admin_works
docker exec "${container}" bash -lc \
    '! grep -q "^admin = " /opt/couchdb/etc/local.d/docker.ini'
stop_image

start_image "${patched_image}" "${fresh_volume}"
wait_health
assert_default_admin_status 401
assert_generated_admin_works
stop_image

start_image "${vulnerable_image}" "${override_volume}"
assert_default_admin_status 200
stop_image

override_user="$(uuidgen | tr -d '-')"
override_password="$(uuidgen | tr -d '-')"
start_image "${patched_image}" "${override_volume}" \
    -e "COUCHDB_USER=${override_user}" -e "COUCHDB_PASSWORD=${override_password}"
wait_health
assert_default_admin_status 401
assert_generated_admin_works
stop_image

echo "CouchDB credential end-to-end checks passed"
