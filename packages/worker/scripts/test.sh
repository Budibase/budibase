#!/bin/bash
set -ex

if [[ -n $CI ]]
then
  jest --coverage --maxWorkers=2 --forceExit --bail $@
else
  jest --coverage --detectOpenHandles --runInBand $@
fi