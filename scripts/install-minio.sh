#!/bin/bash

if [[ $TARGETBUILD == "aas" ]]; then
  echo "A aas-compatible version of Minio is already installed."
  exit 0
fi

if [[ $TARGETARCH == arm* ]]; then
  echo "INSTALLING ARM64 MINIO"
  rm -f minio
  wget https://dl.min.io/server/minio/release/linux-arm64/minio
else
  echo "INSTALLING AMD64 MINIO"
  rm -f minio
  wget https://dl.min.io/server/minio/release/linux-amd64/minio
fi

chmod +x minio
