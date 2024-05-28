#!/bin/bash

# Check if the pro submodule is loaded
if [ ! -d "./packages/pro/src" ]; then
  echo "[ERROR] Submodule is not loaded. This is only allowed with loaded submodules."
  exit 1
fi

yarn build:apps
docker compose -f hosting/docker-compose.build.yaml -f hosting/docker-compose.dev.yaml --env-file hosting/.env up --build --scale proxy-service=0

