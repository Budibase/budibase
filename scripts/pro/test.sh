#!/bin/bash

# Fail when any command fails
set -e

cd ../
if [[ -d "budibase-pro" ]]; then
  cd budibase-pro
  yarn test
  cd ../budibase
fi