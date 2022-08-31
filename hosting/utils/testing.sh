#!/bin/bash

function dockerInstalled {
    echo "Checking docker installation..."
    if [ ! -x "$(command -v docker)" ]; then
        echo "Please install docker to continue"
	exit -1
    fi
}

dockerInstalled

source "${BASH_SOURCE%/*}/hosting.properties"

opts="-e MINIO_ROOT_USER=$minio_access_key -e MINIO_ROOT_PASSWORD=$minio_secret_key"
if [ -n "$minio_secret_key_old" ] && [ -n "$minio_access_key_old" ]; then
    opts="$opts -e MINIO_ROOT_PASSWORD_OLD=$minio_secret_key_old -e MINIO_ROOT_USER_OLD=$minio_access_key_old"
fi

docker run -p $minio_port:$minio_port $opts -v /mnt/data:/data minio/minio server /data
