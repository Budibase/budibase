#!/bin/bash
if [[ $TARGETARCH == arm* ]] ;
then
  wget https://dl.min.io/server/minio/release/linux-arm64/minio
else
  wget https://dl.min.io/server/minio/release/linux-amd64/minio
fi
chmod +x minio
