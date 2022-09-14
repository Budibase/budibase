#!/bin/bash

# Cleanup
if [[ -f "openapi.yaml" ]]; then
    rm openapi.yaml
fi
if [[ -d "generated" ]]; then
    rm -r generated
fi
if [[ -d "../docs" ]]; then
    rm -r ../docs
fi
if [[ -d "../src" ]]; then
    rm -r ../src
fi

# Generate new SDK
mkdir generated
cp ../../server/specs/openapi.yaml ./
docker run --rm \
  -v ${PWD}/openapi.yaml:/openapi.yml \
  -v ${PWD}/generated:/generated \
  -u $(id -u):$(id -g) \
  swaggerapi/swagger-codegen-cli-v3 generate \
  -i /openapi.yml \
  -l javascript \
  -o /generated

# Use a subset of the generated files
mv generated/docs ../
mv generated/src ../

# Cleanup
if [[ -f "openapi.yaml" ]]; then
    rm openapi.yaml
fi
if [[ -d "generated" ]]; then
    rm -r generated
fi