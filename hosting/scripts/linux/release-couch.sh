#!/bin/bash

tag=$1

if [[ ! "$tag" ]]; then
        echo "No tag present. You must pass a tag to this script"
        exit 1
fi

echo "Tagging images with tag: $tag"

docker tag budibase-couchdb budibase/database:$tag

docker push --all-tags budibase/database

