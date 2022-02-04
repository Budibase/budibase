#!/bin/bash

if [[ ! -z "${PRO}" ]]; then
  echo "Installing pro package"
  rm -rf node_modules/@budibase/pro
  unzip pro.zip -d node_modules/@budibase
  rm pro.zip
fi