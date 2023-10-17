# Cypress ESLint Plugin [![CircleCI](https://circleci.com/gh/cypress-io/eslint-plugin-cypress/tree/master.svg?style=svg)](https://circleci.com/gh/cypress-io/eslint-plugin-cypress/tree/master)

An [ESLint](https://eslint.org) plugin for your [Cypress](https://cypress.io) tests.

Note: If you installed ESLint globally then you must also install `eslint-plugin-cypress` globally.

## Installation

```sh
npm install eslint-plugin-cypress --save-dev
```
or
```sh
yarn add eslint-plugin-cypress --dev
```

## Usage

Add an `.eslintrc.json` file to your `cypress` directory with the following:

```json
{
  "plugins": [
    "cypress"
  ]
}
```

You can add rules:

```json
{
  "rules": {
    "cypress/no-assigning-return-values": "error",
    "cypress/no-unnecessary-waiting": "error",
    "cypress/assertion-before-screenshot": "warn",
    "cypress/no-force": "warn",
    "cypress/no-async-tests": "error",
    "cypress/no-pause": "error"
  }
}
```

You can allow certain globals provided by Cypress:

```json
{
  "env": {
    "cypress/globals": true
  }
}
```

## Recommended configuration

Use the recommended configuration and you can forego configuring _plugins_, _rules_, and _env_ individually. See below for which rules are included.

```json
{
  "extends": [
    "plugin:cypress/recommended"
  ]
}
```

## Disable rules

You can disable specific rules per file, for a portion of a file, or for a single line.

Disable the `cypress/no-unnecessary-waiting` rule for the entire file by placing this at the start of the file:

```js
/* eslint-disable cypress/no-unnecessary-waiting */
```

Disable the `cypress/no-unnecessary-waiting` rule for a portion of the file:

```js
it('waits for a second', () => {
  ...
  /* eslint-disable cypress/no-unnecessary-waiting */
  cy.wait(1000)
  /* eslint-enable cypress/no-unnecessary-waiting */
  ...
})
```

Disable the `cypress/no-unnecessary-waiting` rule for a specific line:

```js
it('waits for a second', () => {
  ...
  cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
  ...
})
```

You can also disable a rule for the next line:

```js
it('waits for a second', () => {
  ...
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000)
  ...
})
```

For more, see the [ESLint rules](https://eslint.org/docs/user-guide/configuring/rules) documentation.

## Rules

These rules enforce some of the [best practices recommended for using Cypress](https://on.cypress.io/best-practices).

Rules with a check mark (✅) are enabled by default while using the `plugin:cypress/recommended` config.

**NOTE**: These rules currently require eslint 5.0 or greater. If you would like support added for eslint 4.x, please 👍  [this issue](https://github.com/cypress-io/eslint-plugin-cypress/issues/14).

|     | Rule ID                                                                    | Description                                                     |
| :-- | :------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| ✅  | [no-assigning-return-values](./docs/rules/no-assigning-return-values.md)   | Prevent assigning return values of cy calls                     |
| ✅  | [no-unnecessary-waiting](./docs/rules/no-unnecessary-waiting.md)           | Prevent waiting for arbitrary time periods                      |
| ✅  | [no-async-tests](./docs/rules/no-async-tests.md)                           | Prevent using async/await in Cypress test case                  |
|     | [no-force](./docs/rules/no-force.md)                                       | Disallow using `force: true` with action commands               |
|     | [assertion-before-screenshot](./docs/rules/assertion-before-screenshot.md) | Ensure screenshots are preceded by an assertion                 |
|     | [require-data-selectors](./docs/rules/require-data-selectors.md)           | Only allow data-\* attribute selectors (require-data-selectors) |
|     | [no-pause](./docs/rules/no-pause.md)           | Disallow `cy.pause()` parent command |

## Chai and `no-unused-expressions`

Using an assertion such as `expect(value).to.be.true` can fail the ESLint rule `no-unused-expressions` even though it's not an error in this case. To fix this, you can install and use [eslint-plugin-chai-friendly](https://www.npmjs.com/package/eslint-plugin-chai-friendly).

```sh
npm install --save-dev eslint-plugin-chai-friendly
```

In your `.eslintrc.json`:

```json
{
  "plugins": [
    "cypress",
    "chai-friendly"
  ],
  "rules": {
    "no-unused-expressions": 0,
    "chai-friendly/no-unused-expressions": 2
  }
}
```

Or you can simply add its `recommended` config:

```json
{
  "extends": ["plugin:chai-friendly/recommended"]
}
```

## Contribution Guide

To add a new rule:
  * Fork and clone this repository
  * Generate a new rule (a [yeoman generator](https://github.com/eslint/generator-eslint) is available)
  * Run `yarn start` or `npm start`
  * Write test scenarios then implement logic
  * Describe the rule in the generated `docs` file
  * Make sure all tests are passing
  * Add the rule to this README
  * Create a PR

Use the following commit message conventions: https://github.com/semantic-release/semantic-release#commit-message-format
