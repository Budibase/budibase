#!/bin/bash
yarn build --scope @budibase/server --scope @budibase/worker
./scripts/generatePackageNamesFile.sh
docker build -f hosting/single/Dockerfile -t budibase:latest .
