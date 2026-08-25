#!/bin/bash
cd "$(dirname "$0")/.."
yarn build:apps

docker build \
  -f hosting/single/Dockerfile \
  -t budibase:latest \
  --build-arg BUDIBASE_VERSION=0.0.0+local \
  --build-arg TARGETBUILD=single \
  .
