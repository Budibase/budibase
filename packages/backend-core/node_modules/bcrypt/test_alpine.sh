#!/bin/sh

set -xe

echo "Running on $(node -v)"

apk add make g++ python
npm test --unsafe-perm

./node_modules/.bin/node-pre-gyp configure
./node_modules/.bin/node-pre-gyp build
./node_modules/.bin/node-pre-gyp package
