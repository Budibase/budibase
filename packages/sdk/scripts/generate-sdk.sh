#!/bin/bash

# Cleanup previous generated files
if [[ -f "openapi.yaml" ]]; then
    rm openapi.yaml
fi
if [[ -d "generated" ]]; then
    rm -r generated
fi
if [[ -d "../src/generated" ]]; then
    rm -r ../src/generated
fi

# Generate new SDK
mkdir generated
cp ../../server/specs/openapi.yaml ./
docker run --rm \
  -v ${PWD}/openapi.yaml:/openapi.yml \
  -v ${PWD}/generated:/generated \
  -v ${PWD}/config.json:/config.json \
  -u $(id -u):$(id -g) \
  swaggerapi/swagger-codegen-cli-v3:3.0.46 generate \
  -i /openapi.yml \
  -l javascript \
  -o /generated \
  -c /config.json

# Move generated files to the correct location
mkdir -p ../src/generated
mv generated/src/* ../src/generated/

# Cleanup
if [[ -f "openapi.yaml" ]]; then
    rm openapi.yaml
fi
if [[ -d "generated" ]]; then
    rm -r generated
fi
