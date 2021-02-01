#!/bin/bash

tag=$1
tag=${tag:-latest}

pushd ../../build
docker-compose build --force app-service
docker-compose build --force worker-service

docker tag build_app-service budibase/budibase-apps:$tag
docker tag build_worker-service budibase/budibase-worker:$tag

docker push budibase/budibase-apps
docker push budibase/budibase-worker
popd
