#!/bin/bash

redis-server --requirepass $REDIS_PASSWORD > /dev/stdout 2>&1 &
/bbcouch-runner.sh &
/minio/minio server ${DATA_DIR}/minio --console-address ":9001" > /dev/stdout 2>&1 &

echo "Test environment started..."
sleep infinity