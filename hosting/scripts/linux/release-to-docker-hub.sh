#!/bin/bash

tag=$1
tag=${tag:-latest}

echo "Tagging images with SHA: $GITHUB_SHA and version: $BUDIBASE_VERSION"

docker tag app-service budibase/apps:$tag
docker tag worker-service budibase/worker:$tag

# Tag with git sha
docker tag app-service budibase/apps:$GITHUB_SHA
docker tag worker-service budibase/worker:$GITHUB_SHA

docker push budibase/apps
docker push budibase/worker
