#!/usr/bin/env sh
set -eu

if [ ! -f /certs/ca.crt ] || [ ! -f /certs/server.crt ] || [ ! -f /certs/server.key ]; then
  echo "TLS certificates not found in /certs. Run hosting/redis-tls/generate-certs.sh first."
  exit 1
fi

if [ -z "${REDIS_TLS_USERNAME:-}" ] || [ -z "${REDIS_TLS_PASSWORD:-}" ]; then
  echo "REDIS_TLS_USERNAME and REDIS_TLS_PASSWORD must be set."
  exit 1
fi

cat > /usr/local/etc/redis/users.acl <<EOF
user default off
user ${REDIS_TLS_USERNAME} on >${REDIS_TLS_PASSWORD} allcommands allkeys allchannels
EOF

exec redis-server /usr/local/etc/redis/redis.conf
