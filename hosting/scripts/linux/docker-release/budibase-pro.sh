#!/bin/bash

tag=$1

if [[ ! "$tag" ]]; then
	echo "No tag present. You must pass a tag to this script"
	exit 1
fi

echo "Tagging images with tag: $tag"

docker tag app-service-pro budibase/apps-pro:$tag
docker tag worker-service-pro budibase/worker-pro:$tag

docker push --all-tags budibase/apps-pro
docker push --all-tags budibase/worker-pro
