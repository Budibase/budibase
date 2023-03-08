#!/bin/bash
if [[ $TARGETARCH == arm* ]] ;
then
  echo "INSTALLING ARM64 MINIO"
  wget https://dl.min.io/server/minio/release/linux-arm64/archive/minio.RELEASE.2022-10-24T18-35-07Z
else
  echo "INSTALLING AMD64 MINIO"
  wget https://dl.min.io/server/minio/release/linux-amd64/minio.RELEASE.2022-10-24T18-35-07Z
fi
chmod +x minio
