#!/bin/bash

if [[ -z "${REDIS_CONFIG}" ]]; then
    REDIS_CONFIG="/etc/redis/redis.conf"
fi

if [[ -n "${REDIS_CONFIG}" && -f "${REDIS_CONFIG}" ]]; then
    sed -i "s#DATA_DIR#${DATA_DIR}#g" "${REDIS_CONFIG}"
fi

if [[ -n "${USE_DEFAULT_REDIS_CONFIG}" ]]; then
    unset REDIS_CONFIG
fi

REDIS_LAUNCH_SCRIPT="/tmp/redis-server-launch.sh"
cat <<EOF > "$REDIS_LAUNCH_SCRIPT"
#!/bin/bash

if [[ -n "\${REDIS_CONFIG}" ]]; then
    CMD=("redis-server" "\${REDIS_CONFIG}")
else
    CMD=("redis-server")
fi

if [[ -n "\${REDIS_USERNAME}" && -n "\${REDIS_PASSWORD}" ]]; then
    CMD+=("--user" "\${REDIS_USERNAME}" "--requirepass" "\${REDIS_PASSWORD}")
elif [[ -n "\${REDIS_PASSWORD}" ]]; then
    CMD+=("--requirepass" "\${REDIS_PASSWORD}")
fi

exec "\${CMD[@]}"
EOF

chmod +x "$REDIS_LAUNCH_SCRIPT"

echo "Starting redis-server with pm2..."
pm2 start "$REDIS_LAUNCH_SCRIPT" --name redis-server --interpreter bash
