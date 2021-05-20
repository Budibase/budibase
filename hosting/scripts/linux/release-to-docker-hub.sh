#!/bin/bash

tag=$1
tag=${tag:-latest}


pushd ../../build
docker-compose build --force app-service
docker-compose build --force worker-service

echo "Tagging images with SHA: $GITHUB_SHA and version: $BUDIBASE_VERSION"

docker tag build_app-service budibase/apps:$tag
docker tag build_worker-service budibase/worker:$tag

# Tag with git sha
docker tag build_app-service budibase/apps:$GITHUB_SHA
docker tag build_worker-service budibase/worker:$GITHUB_SHA

docker push budibase/apps
docker push budibase/worker
popd
