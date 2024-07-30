#!/bin/bash

yarn build:apps
docker compose -f hosting/docker-compose.build.yaml -f hosting/docker-compose.dev.yaml --env-file hosting/.env up --build --scale proxy-service=0

