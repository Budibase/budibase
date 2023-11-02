#!/bin/bash
if [[ $TARGETARCH == arm* ]] ;
then
  echo "INSTALLING ARM64 MINIO"
  wget wget https://dl.min.io/server/minio/release/linux-arm64/archive/minio.deb -O minio.deb
else
  echo "INSTALLING AMD64 MINIO"
  wget wget https://dl.min.io/server/minio/release/linux-amd64/archive/minio.deb -O minio.deb
fi
dpkg -i minio.deb
