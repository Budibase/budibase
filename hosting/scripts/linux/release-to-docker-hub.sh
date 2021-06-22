#!/bin/bash

tag=$1
tag=${tag:-latest}

echo "Tagging images with SHA: $GITHUB_SHA and tag: $tag"

docker tag app-service budibase/apps:$tag
docker tag worker-service budibase/worker:$tag

docker push budibase/apps:$tag 
docker push budibase/worker:$tag
