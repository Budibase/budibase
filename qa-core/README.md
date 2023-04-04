# QA Core API Tests

The QA Core API tests are a jest suite that run directly against the budibase backend APIs.

## Auto Setup

You can run the whole test suite with one command, that spins up the budibase server and runs the jest tests:

`yarn api:test`

## Setup Server Only

You can also just stand up the budibase server alone.

`yarn api:server:setup`

## Run Tests

If you configured the server using the previous command, you can run the whole test suite by using:

`yarn test`

for watch mode, where the tests will run on every change:

`yarn test:watch`

To run tests locally against a cloud service you can use the command:
`yarn run api:test:local`

To run the tests in CI, it assumes the correct environment variables are set, and the server is already running. Use the command:
`yarn run api:test:ci`

To run the nightly tests against the QA environment, use the command:
`yarn run api:test:nightly`
