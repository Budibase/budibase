'use strict'

const rule = require('../../../lib/rules/no-async-tests')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
// async functions are an ES2017 feature
const parserOptions = { ecmaVersion: 8 }

ruleTester.run('no-async-tests', rule, {
  valid: [
    { code: 'it(\'a test case\', () => { cy.get(\'.someClass\'); })', parserOptions },
    { code: 'it(\'a test case\', async () => { await somethingAsync(); })', parserOptions },
    { code: 'async function nonTestFn () { return await somethingAsync(); }', parserOptions },
    { code: 'const nonTestArrowFn = async () => { await somethingAsync(); }', parserOptions },
  ],
  invalid: [
    { code: 'it(\'a test case\', async () => { cy.get(\'.someClass\'); })', parserOptions, errors },
    { code: 'test(\'a test case\', async () => { cy.get(\'.someClass\'); })', parserOptions, errors },
    { code: 'it(\'a test case\', async function () { cy.get(\'.someClass\'); })', parserOptions, errors },
    { code: 'test(\'a test case\', async function () { cy.get(\'.someClass\'); })', parserOptions, errors },
  ],
})
