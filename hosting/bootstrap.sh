#!/usr/bin/env bash

GITHUB_BASE_URL=https://raw.githubusercontent.com/Budibase/budibase/master/hosting

if ! [ -x "$(command -v wget)" ]; then
  echo 'Error: wget is not installed. Please install it for your operating system.' >&2
  exit 1
fi

fetch_config_files() {
  wget $GITHUB_BASE_URL/docker-compose.yaml
  wget $GITHUB_BASE_URL/envoy.yaml
  wget $GITHUB_BASE_URL/hosting.properties
  wget $GITHUB_BASE_URL/start.sh
}

fetch_config_files