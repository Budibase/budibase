#!/bin/bash
yarn global add zbctl
export ZEEBE_ADDRESS='localhost:26500'

cd ../budibase-bpm

is_camunda_ready() {
    if (zbctl --insecure status 2>/dev/null) | grep -q 'Healthy'; then
        return 1
    else
        return 0
    fi
}

docker-compose up -d
echo "waiting for Camunda to be ready..."

while is_camunda_ready -eq 0; do sleep 1; done

echo "deploy processes..."
for file in src/main/resources/models/*; do
    zbctl deploy resource $file --insecure
done

cd ../budibase/packages/pro
yarn && yarn build

cd ../account-portal/packages/server 
yarn worker:run & cd ../../../.. && yarn dev:accountportal



