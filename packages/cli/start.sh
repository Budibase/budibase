#!/bin/bash
dir="$(dirname -- "$(readlink -f "${BASH_SOURCE}")")"
${dir}/node_modules/ts-node/dist/bin.js ${dir}/src/index.ts $@
