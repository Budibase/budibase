#!/bin/bash

: ${CLIENT:="node"}

if [ "$CLIENT" == "node" ]; then
    npm run test-node
else
    npm run test-browser
fi
