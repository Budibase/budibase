#!/bin/sh
set -eu

. ./gitlab/images.env

docker version
docker buildx version
docker buildx inspect --bootstrap

mkdir -p gitlab/image-metadata
inspect_image() {
  docker buildx imagetools inspect "$2" --raw > "gitlab/image-metadata/$1.manifest.json"
  docker buildx imagetools inspect "$2" --format '{{json .Image}}' > "gitlab/image-metadata/$1.config.json"
}

inspect_image redis "$GRAVITY_REDIS_IMAGE"
inspect_image busybox "$GRAVITY_BUSYBOX_IMAGE"
inspect_image node "$GRAVITY_NODE_IMAGE"
inspect_image nginx "$GRAVITY_NGINX_IMAGE"
inspect_image database "$GRAVITY_DATABASE_IMAGE"
