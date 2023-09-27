#!/bin/bash
set -e

if [[ -n $CI ]]
then
  # Running in ci, where resources are limited
  echo "jest --coverage --maxWorkers=2  --forceExit --bail"
  jest --coverage --maxWorkers=2  --forceExit --bail
else
  # --maxWorkers performs better in development
  echo "jest --coverage --maxWorkers=2 --forceExit"
  jest --coverage --maxWorkers=2 --forceExit
fi