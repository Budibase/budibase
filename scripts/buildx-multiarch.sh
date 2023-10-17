#!/bin/bash
sudo apt-get install -y qemu qemu-user-static
docker buildx create --name budibase
docker buildx use budibase
