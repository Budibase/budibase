#!/bin/bash
cd ../
if [[ -d "budibase-pro" ]]; then
  cd budibase-pro
  yarn test
  cd ../budibase
fi