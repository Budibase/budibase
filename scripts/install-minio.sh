#!/bin/bash
if [[ $TARGETARCH == arm* ]] ;
then
  echo "INSTALLING ARM64 MINIO"
  wget https://dl.min.io/server/minio/release/linux-arm64/minio
else
  echo "INSTALLING AMD64 MINIO"
  wget https://dl.min.io/server/minio/release/linux-amd64/minio
fi
chmod +x minio