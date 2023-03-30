#!/bin/bash
set -e

if [[ -n $CI ]]
then
  # --runInBand performs better in ci where resources are limited
  echo "jest --coverage --runInBand"
  jest --coverage --runInBand --forceExit
else
  # --maxWorkers performs better in development
  echo "jest --coverage"
  jest --coverage --forceExit
fi