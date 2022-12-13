#!/bin/bash

redis-server --requirepass $REDIS_PASSWORD > /dev/stdout 2>&1 &
/bbcouch-runner.sh &
/minio/minio server ${DATA_DIR}/minio > /dev/stdout 2>&1 &

echo "Test environment started..."
sleep infinity