#!/bin/bash

tag=$1

if [[ ! "$tag" ]]; then
	echo "No tag present. You must pass a tag to this script"
	exit 1
fi

echo "Tagging images with tag: $tag"

docker tag proxy-service budibase/proxy:$tag
docker tag app-service budibase/apps:$tag
docker tag worker-service budibase/worker:$tag

docker push --all-tags budibase/apps 
docker push --all-tags budibase/worker
docker push --all-tags budibase/proxy
