#!/bin/bash

tag=$1
tag=${tag:-latest}

echo "Tagging images with SHA: $GITHUB_SHA and tag: $tag"

docker tag app-service:$tag budibase/apps:$tag
docker tag worker-service:$tag budibase/worker:$tag

# Tag with git sha
docker tag app-service:$tag budibase/apps:$GITHUB_SHA
docker tag worker-service:$tag budibase/worker:$GITHUB_SHA

docker push budibase/apps
docker push budibase/worker
