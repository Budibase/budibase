#!/bin/bash

if [[ $TARGETBUILD == "aas" ]]; then
  echo "INSTALLING AAS MINIO (2022 gateway-compatible build)"
  wget https://dwiquhvocfant.cloudfront.net/minio/minio # this is a Budibase controlled CF distribution
  chmod +x minio
  exit 0
fi

if [[ $TARGETARCH == arm* ]]; then
  echo "INSTALLING ARM64 MINIO"
  wget https://dl.min.io/server/minio/release/linux-arm64/minio
else
  echo "INSTALLING AMD64 MINIO"
  wget https://dl.min.io/server/minio/release/linux-amd64/minio
fi

chmod +x minio
