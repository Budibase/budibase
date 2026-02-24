#!/bin/bash

if [[ $TARGETBUILD == "aas" ]]; then
  echo "A aas-compatible version of Minio is already installed."
  exit 0
fi

# Use --no-check-certificate when behind a corporate proxy that does SSL inspection
if [[ $TARGETARCH == arm* ]]; then
  echo "INSTALLING ARM64 MINIO"
  rm -f minio
  wget --no-check-certificate https://dl.min.io/server/minio/release/linux-arm64/minio || \
    curl -k -fsSL -o minio https://dl.min.io/server/minio/release/linux-arm64/minio
else
  echo "INSTALLING AMD64 MINIO"
  rm -f minio
  wget --no-check-certificate https://dl.min.io/server/minio/release/linux-amd64/minio || \
    curl -k -fsSL -o minio https://dl.min.io/server/minio/release/linux-amd64/minio
fi

chmod +x minio
