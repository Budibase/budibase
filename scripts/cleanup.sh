#!/bin/bash
dir=$(pwd)
mv dist /
mv package.json /
cd /
rm -r $dir
mkdir $dir
mv /dist $dir
mv /package.json $dir
cd $dir
NODE_ENV=production yarn
