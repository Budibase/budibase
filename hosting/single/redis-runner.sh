#!/bin/bash

REDIS_CONFIG="/etc/redis/redis.conf"

sed -i "s#DATA_DIR#${DATA_DIR}#g" "${REDIS_CONFIG}"

REDIS_LAUNCH_SCRIPT="/tmp/redis-server-launch.sh"
cat <<'EOF' > "$REDIS_LAUNCH_SCRIPT"
#!/bin/bash

CMD=("redis-server" "/etc/redis/redis.conf")

if [[ -n "${REDIS_USERNAME}" && -n "${REDIS_PASSWORD}" ]]; then
    CMD+=("--user" "${REDIS_USERNAME}" "--requirepass" "${REDIS_PASSWORD}")
elif [[ -n "${REDIS_PASSWORD}" ]]; then
    CMD+=("--requirepass" "${REDIS_PASSWORD}")
fi

exec "${CMD[@]}"
EOF

chmod +x "$REDIS_LAUNCH_SCRIPT"

echo "Starting redis-server with pm2..."
pm2 start "$REDIS_LAUNCH_SCRIPT" --name redis-server --interpreter bash
