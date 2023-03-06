#!/bin/bash

tag=$1

if [[ ! "$tag" ]]; then
	echo "No tag present. You must pass a tag to this script"
	exit 1
fi

echo "Tagging images with tag: $tag"

docker tag proxy-service starzeus/budibase-proxy:$tag
docker tag app-service starzeus/budibase-apps:$tag
docker tag worker-service starzeus/budibase-worker:$tag

docker push starzeus/budibase-apps:$tag 
docker push starzeus/budibase-worker:$tag
docker push starzeus/budibase-proxy:$tag
