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

cd src/main/resources/models

echo "deploy processes..."
zbctl deploy resource offboarding.bpmn --insecure
zbctl deploy resource onboarding.bpmn --insecure
zbctl deploy resource free_trial.bpmn --insecure
zbctl deploy resource verify_sso_login.bpmn --insecure

cd ../../../../../budibase/packages/account-portal/packages/server 

yarn worker:run & cd ../../../.. && yarn dev:accountportal



