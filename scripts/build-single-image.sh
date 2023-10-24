#!/bin/bash
yarn build --scope @budibase/server --scope @budibase/worker
version=$(./scripts/getCurrentVersion.sh)
docker build -f hosting/single/Dockerfile.v2 -t budibase:latest --build-arg BUDIBASE_VERSION=$version .
