# QA Core API Tests

The QA Core API tests are a jest suite that run directly against the budibase backend APIs.

## Auto Setup

You can run the whole test suite with one command, that spins up the budibase server and runs the jest tests:

`yarn test:ci`

## Setup Server

You can run the local development stack by following the instructions on the main readme.

## Run Tests

If you configured the server using the previous command, you can run the whole test suite by using:

`yarn test`

for watch mode, where the tests will run on every change:

`yarn test:watch`

To run tests locally against a cloud service you can update the configuration inside the `.env` file and run:

`yarn test`

