#!/bin/bash
yarn build --scope @budibase/server --scope @budibase/worker
docker build -f hosting/single/Dockerfile -t budibase:latest .
