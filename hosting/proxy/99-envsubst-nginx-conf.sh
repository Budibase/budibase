#!/bin/sh

set -e

case "$ENABLE_DYNAMIC_CONFIG" in
        ""|0|false|no) exit 0;;
        *) echo >&2 Using dynamic config.;;
esac

tmp="$(mktemp)"

# shellcheck disable=SC2016
envsubst '
        ${APPS_UPSTREAM_URL}
        ${WORKER_UPSTREAM_URL}
        ${MINIO_UPSTREAM_URL}
        ${WATCHTOWER_UPSTREAM_URL}
        ${RESOLVER}
        ' \
        </etc/nginx/nginx-dyn.conf.template >"$tmp"

mv "$tmp" /etc/nginx/nginx.conf
