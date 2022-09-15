#!/bin/bash
dir=$(pwd)
declare -a keep=("dist" "package.json" "yarn.lock" "client" "builder" "build" "pm2.config.js" "docker_run.sh")
for moveDir in "${keep[@]}"
do
  mv $moveDir / 2>/dev/null
done
cd /
rm -r $dir
mkdir $dir
for keepDir in "${keep[@]}"
do
  mv /$keepDir $dir/ 2>/dev/null
done
cd $dir
NODE_ENV=production yarn
