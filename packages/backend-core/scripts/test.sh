#!/bin/bash

if [[ -n $CI ]]
then
  # --runInBand performs better in ci where resources are limited
  echo "jest --coverage --runInBand --forceExit"
  jest --coverage --runInBand --forceExit
else
  # --maxWorkers performs better in development
  echo "jest --coverage"
  jest --coverage
fi
