#!/bin/bash
echo "**** WARNING - not for production environments ****"
# warning this is a convenience script, for production installations install docker
# properly for your environment!
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
