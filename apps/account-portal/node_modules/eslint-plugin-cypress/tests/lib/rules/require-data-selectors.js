'use strict'

const rule = require('../../../lib/rules/require-data-selectors')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 6 }

ruleTester.run('require-data-selectors', rule, {
  valid: [
    { code: 'cy.get(\'[data-cy=submit]\').click()', parserOptions },
    { code: 'cy.get(\'[data-QA=submit]\')', parserOptions },
    { code: 'cy.clock(5000)', parserOptions },
    { code: 'cy.scrollTo(0, 10)', parserOptions },
    { code: 'cy.tick(500)', parserOptions },
    { code: 'cy.get(\`[data-cy=${1}]\`)', parserOptions },
    { code: 'cy.get("@my-alias")', parserOptions, errors },
    { code: 'cy.get(`@my-alias`)', parserOptions, errors },
  ],

  invalid: [
    { code: 'cy.get(\'[daedta-cy=submit]\').click()', parserOptions, errors },
    { code: 'cy.get(\'[d-cy=submit]\')', parserOptions, errors },
    { code: 'cy.get(".btn-large").click()', parserOptions, errors },
    { code: 'cy.get(".btn-.large").click()', parserOptions, errors },
    { code: 'cy.get(".a")', parserOptions, errors },
    { code: 'cy.get(\`[daedta-cy=${1}]\`)', parserOptions, errors },
  ],
})
