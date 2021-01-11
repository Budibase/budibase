#!/bin/bash
pushd ../../build
docker-compose build --force app-service
docker-compose build --force worker-service
docker tag build_app-service budibase/budibase-apps:latest
docker push budibase/budibase-apps
docker tag build_worker-service budibase/budibase-worker:latest
docker push budibase/budibase-worker
popd
