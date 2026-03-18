#!/bin/bash
set -e

if [[ -n $CI ]]
then
  # Running in ci, where resources are limited
  echo "jest --maxWorkers=2 --forceExit --bail $@"
  jest --maxWorkers=2 --forceExit --bail $@
else
  # --maxWorkers performs better in development
  echo "jest --coverage --detectOpenHandles $@"
  jest --coverage --detectOpenHandles $@
fi
