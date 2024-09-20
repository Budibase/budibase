#!/bin/bash

yarn build:apps
version=$(./scripts/getCurrentVersion.sh)
docker build -f hosting/single/Dockerfile -t budibase:sqs --build-arg BUDIBASE_VERSION=$version --build-arg TARGETBUILD=single --build-arg BASEIMG=budibase/couchdb:v3.3.3-sqs-v2.1.1 .
