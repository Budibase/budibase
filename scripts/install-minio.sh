#!/bin/bash

if [[ $TARGETBUILD == "aas" ]]; then
  echo "INSTALLING AAS MINIO (2022 gateway-compatible build)"
  wget -O minio https://dwiquhvocfant.cloudfront.net/minio/minio # this is a Budibase controlled CF distribution
  chmod +x minio
  exit 0
fi

chmod +x minio
