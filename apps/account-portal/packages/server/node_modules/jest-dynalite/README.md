# jest-dynalite

[![Pipeline status](https://github.com/freshollie/jest-dynalite/workflows/Pipeline/badge.svg)](https://github.com/freshollie/jest-dynalite/actions)
[![Coverage Status](https://coveralls.io/repos/github/freshollie/jest-dynalite/badge.svg?branch=master)](https://coveralls.io/github/freshollie/jest-dynalite?branch=master)
[![Npm version](https://img.shields.io/npm/v/jest-dynalite)](https://www.npmjs.com/package/jest-dynalite)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> Enchaned unit testing, with a mock DynamoDB instance

`jest-dynalite` is a fork of [@shelf/jest-dynamodb](https://github.com/shelfio/jest-dynamodb) that allows unit tests to execute real
queries against a local DynamoDB instance. It was created in an attempt to address some of the most important missing
features of `@shelf/jest-dynamodb`, such as requiring all your tests to use a single shared database. See [this issue](https://github.com/shelfio/jest-dynamodb/issues/55) for more motivation.

## Why should I use this?

Using this `jest-dynalite` makes writing queries with DynamoDB very easy, your tests can really
check if your data is manipulated in the way you expect it to be. This means that queries and mutations
can be developed without ever having to deploy or run your application, and significantly speeds up
writing code which interacts with DynamoDB.

This in turn makes your tests much more robust, because a change to a data structure or
db query in your application will be reflected by failing tests, instead of using mocks to check
if calls were made correctly.

This library could almost be seen as an integration test, but without the overhead of typical integration tests.

## Features

- Optionally clear tables between tests
- Isolated tables between test runners
- Ability to specify config directory
- No `java` requirement
- Works with both `@aws-sdk/client-dynamodb` and `aws-sdk`

## **BREAKING CHANGES**

From `v2.0.0` `jest-dynalite` now uses a JavaScript file for table configuration. This change makes it possible to set the dynalite config programatically (enabling things such as reading the parameters from a cloudformation template) while also improving compatibility with jest-dynamodb. Thanks to [@corollari](https://github.com/corollari) for this change.

From `v3.0.0` you can now use the preset in a monorepo. The `jest-dynalite-config.js` will be picked up from your jest `<rootDir>`, which should be the same directory as your jest config.

### `@aws-sdk/client-dynamodb`

With the release of `v3.3.0` it is now possible to use `@aws-sdk/client-dynamodb` instead of `aws-sdk`.

However, it seems that with this new version the dynamodb client connection stays active for a few seconds after your tests have finished and thus stops `dynalite` from being able to teardown after each test suite (test file).

Make sure you run `client.destroy()` on your client after every test suite to mitigate this issue. See an example [here](#Update-your-sourcecode)

## Installation

```bash
$ yarn add jest-dynalite -D
```

(Make sure you have `@aws-sdk/client-dynamodb` or `aws-sdk` also installed)

## Examples

Please follow the [below config](#config) to setup your tests to use `jest-dynalite`. However, if you are looking for
some example project structures, please see the [examples](https://github.com/freshollie/jest-dynalite/tree/master/e2e).

## Timeouts

Because jest has a default timeout of 5000ms per test, `jest-dynalite` can sometimes cause failures due to the timeout
being exceeded. This can happen when there are many tests or lots of tables to create between tests.

If this happens, try increasing your test timeouts `jest.setTimeout(10000)`. Another option is to selectively
run the database only for suites which use it. Please see [advanced config](###Advanced-setup).

## Config

In your jest project root (next to your `jest.config.js`), create a `jest-dynalite-config.js` (or `.cjs` or `.ts`) with the tables schemas,
and an optional `basePort` to run dynalite on:

```js
// use export default for ts based configs
module.exports = {
  tables: [
    {
      TableName: "table",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  ],
  basePort: 8000,
};
```

Some data can be given to exist in the table before each test:

```js
module.exports = {
  tables: [
    {
      TableName: "table",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      data: [
        {
          id: "a",
          someattribute: "hello world",
        },
      ],
    },
  ],
  basePort: 8000,
};
```

Your tables can also be resolved from an optionally async function:

```js
module.exports = {
  // Please note, this function is resolved
  // once per test file
  tables: async () => {
    const myTables = await someFunction();
    if (myTables.find((table) => ...)) {
      return someOtherFunction();
    }
    return myTables;
  },
  basePort: 8000
};
```

## Update your sourcecode

```javascript
const client = new DynamoDB({
  ...yourConfig,
  ...(process.env.MOCK_DYNAMODB_ENDPOINT && {
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: "local",
  }),
});
```

`process.env.MOCK_DYNAMODB_ENDPOINT` is unqiue to each test runner.

After all your tests, make sure you destroy your client.
You can even do this by adding an `afterAll` in a [`setupFilesAfterEnv`](https://jestjs.io/docs/en/configuration#setupfilesafterenv-array) file.

```javascript
afterAll(() => {
  client.destroy();
});
```

## Jest config

### Simple usage (preset)

jest.config.js

```javascript
module.exports = {
  ...
  preset: "jest-dynalite"
}
```

The simple preset config will use the config and clear tables
between tests.

**Important**: Only use this option if you don't have a custom `testEnvironment` set in your `jest.config.js` file.

[Please see example](example/)

### Advanced setup

If you are using your own `testEnvironment` in your Jest configuration, then you must setup
`jest-dynalite` manually. You should also use this manual configuration if you don't want a DynamoDB mock to run
for all your tests (faster).

setupBeforeEnv.js

```javascript
import { setup } from "jest-dynalite";

// You must give it a config directory
setup(__dirname);
```

In every test suite where you are using DynamoDB, apply `import "jest-dynalite/withDb"` to the top of
that test suite to run the db for all the tests in the suite.

If you want the tables to exist for all your suites, create a
`setupAfterEnv.js` file with the content:

```javascript
import "jest-dynalite/withDb";
```

You then must add the setup files to your jest config

jest.config.js

```javascript
module.exports = {
  ...
  setupFiles: ["./setupBeforeEnv.js"],
  setupFilesAfterEnv: ["./setupAfterEnv.js"]
}
```

If you want to be even more granular, you can start
the db yourself at any point.

```javascript
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";

beforeAll(startDb);

// Create tables but don't delete them after tests
beforeAll(createTables);

// or
beforeEach(createTables);
afterEach(deleteTables);

afterAll(stopDb);
```

### Other options

jest.config.js

```javascript
module.exports = {
  ...
  testEnvironment: "jest-dynalite/environment",

  setupFilesAfterEnv: [
    "jest-dynalite/setupTables",
    // Optional (but recommended)
    "jest-dynalite/clearAfterEach"
  ]
}
```

This setup should be used if you want to override the default config of `clearAfterEach`, but still want to use the most simple configuration.

#### One dynalite instance

If you want to start & setup the db **only** once for all your suites,
create a `setup.js` and `teardown.js` files with the following content:

```javascript
// setup.js

import { startDb, createTables, setup } from "jest-dynalite";

module.exports = async () => {
  // You must provide a config directory
  setup(__dirname);
  await startDb();
  await createTables();
};
```

```javascript
// teardown.js

import { stopDb, deleteTables } from "jest-dynalite";

module.exports = async () => {
  // Cleanup after tests
  await deleteTables();
  await stopDb();
};
```

You then must add the setup files to your jest config

jest.config.js

```javascript
module.exports = {
  ...
  globalSetup: ["./setup.js"],
  globalTeardown: ["./teardown.js"],
}
```

**IMPORTANT NOTE**

Be aware that the only one instance of dynalite will start, which may cause test issues if multiple runners are editing the same data.

## Development

Clone the repo and install dependencies

```
yarn
```

Run tests

```
yarn test
```

### Tests

Tests are designed as a mix of unit, integration tests, and e2e tests.

`yarn test` will run all unit and integration tests

Integration tests are configured under the `tests` directory, with
[jest projects](https://jestjs.io/docs/en/configuration#projects-arraystring--projectconfig) used to managed
testing different configurations for jest-dynalite.

`yarn e2e` will run e2e tests

## License

`MIT`
