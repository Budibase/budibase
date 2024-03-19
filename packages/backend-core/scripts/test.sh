#!/bin/bash
set -e

if [[ -n $CI ]]
then
  # --runInBand performs better in ci where resources are limited
  echo "jest --coverage --runInBand --forceExit $@"
  jest --coverage --runInBand --forceExit $@
else
  # --maxWorkers performs better in development
  echo "jest --coverage --forceExit --detectOpenHandles $@"
  jest --coverage --forceExit --detectOpenHandles $@
fi