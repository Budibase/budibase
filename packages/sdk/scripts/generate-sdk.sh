#!/bin/bash

# Cleanup
if [[ -f "openapi.yaml" ]]; then
    rm openapi.yaml
fi
if [[ -d "generated" ]]; then
    rm -r generated
fi
if [[ -d "../sdk" ]]; then
    rm -r ../sdk
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

# Use a subset of the generated files
mv generated/src ../sdk

# Cleanup
if [[ -f "openapi.yaml" ]]; then
    rm openapi.yaml
fi
if [[ -d "generated" ]]; then
    rm -r generated
fi
