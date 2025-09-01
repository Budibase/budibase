#!/bin/bash

REDIS_CONFIG="/etc/redis/redis.conf"
sed -i "s#DATA_DIR#${DATA_DIR}#g" "${REDIS_CONFIG}"

if [[ -n "${USE_DEFAULT_REDIS_CONFIG}" ]]; then
    unset REDIS_CONFIG
fi

REDIS_LAUNCH_SCRIPT="/tmp/redis-server-launch.sh"
cat <<EOF > "$REDIS_LAUNCH_SCRIPT"
#!/bin/bash
if [[ -n "\${REDIS_PASSWORD}" ]]; then
    if [[ -n "\${REDIS_CONFIG}" ]]; then
        exec redis-server "\${REDIS_CONFIG}" --requirepass "\$REDIS_PASSWORD"
    else
        exec redis-server --requirepass "\$REDIS_PASSWORD"
    fi
else
    if [[ -n "\${REDIS_CONFIG}" ]]; then
        exec redis-server "\${REDIS_CONFIG}"
    else
        exec redis-server
    fi
fi
EOF

chmod +x "$REDIS_LAUNCH_SCRIPT"

echo "Starting redis-server with pm2..."
pm2 start "$REDIS_LAUNCH_SCRIPT" --name redis-server --interpreter bash
