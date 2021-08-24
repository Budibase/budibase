#!/bin/bash

tag=$1
production=$2

if [[ ! "$tag" ]]; then
	echo "No tag present. You must pass a tag to this script"
	exit 1
fi

echo "Tagging images with tag: $tag"

docker tag app-service budibase/apps:$tag
docker tag worker-service budibase/worker:$tag

if [[ "$production" ]]; then
	echo "Production Deployment. Tagging latest.."
	docker tag app-service budibase/apps:latest
	docker tag worker-service budibase/worker:latest
fi

docker push --all-tags budibase/apps 
docker push --all-tags budibase/worker
