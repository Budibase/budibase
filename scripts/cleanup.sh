#!/bin/bash
KEEP="dist package.json yarn.lock client builder build pm2.config.js docker_run.sh"
ls | grep -v $(echo ${KEEP} | awk '{split($0,a," ");for (i in a) printf "-e ^"a[i]"$ "}') | xargs rm -fr 
NODE_ENV=production yarn
