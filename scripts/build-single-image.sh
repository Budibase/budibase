#!/bin/bash
yarn build --scope @budibase/server --scope @budibase/worker
version=$(./scripts/getCurrentVersion.sh)
docker build -f hosting/single/Dockerfile -t budibase:latest --build-arg BUDIBASE_VERSION=$version --build-arg TARGETBUILD=single .
