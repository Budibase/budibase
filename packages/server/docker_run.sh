#!/usr/bin/env bash

if [ -z $CLUSTER_MODE ]; then
  yarn run:docker
else
  yarn run:docker:cluster
fi
