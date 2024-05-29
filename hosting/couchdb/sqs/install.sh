#!/bin/bash
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )"
if [[ $TARGETARCH == arm* ]] ;
then
  echo "Installing ARM SQS Client..."
  mv $SCRIPT_DIR/arm/* .
  rm -r $SCRIPT_DIR/arm
  rm -r $SCRIPT_DIR/x86
else
  echo "Installing x86-64 SQS Client..."
  mv $SCRIPT_DIR/x86/* .
  rm -r $SCRIPT_DIR/arm
  rm -r $SCRIPT_DIR/x86
fi
