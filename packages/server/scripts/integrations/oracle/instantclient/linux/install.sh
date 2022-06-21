#!/bin/bash
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )"
if [[ $TARGETARCH == arm* ]] ;
then
  echo "Installing ARM Oracle instant client..."
  $SCRIPT_DIR/arm64/install.sh
else
  echo "Installing x86-64 Oracle instant client..."
  $SCRIPT_DIR/x86-64/install.sh
fi
