#!/bin/bash
if [[ $TARGETARCH == arm* ]] ;
then
  echo "Installing ARM Oracle instant client..."
  arm64/install.sh
else
  echo "Installing x86-64 Oracle instant client..."
  x86-64/install.sh
fi
