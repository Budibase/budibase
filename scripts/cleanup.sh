#!/bin/bash
KEEP="dist|package.json|yarn.lock|client|builder|build|pm2.config.js|docker_run.sh"
echo "Removing unneeded build files:"
ls | egrep -v $KEEP | xargs rm -rfv
NODE_ENV=production yarn
