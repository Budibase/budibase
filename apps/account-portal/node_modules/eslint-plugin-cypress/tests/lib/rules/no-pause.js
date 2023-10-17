'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-pause')

const RuleTester = require('eslint').RuleTester

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 2018 }

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester()

ruleTester.run('no-pause', rule, {

  valid: [
    // for now, we do not detect .pause() child command
    { code: `cy.get('button').pause()`, parserOptions },
    { code: `pause()`, parserOptions },
    { code: `cy.get('button').dblclick()`, parserOptions },
  ],

  invalid: [
    { code: `cy.pause()`, parserOptions, errors },
    { code: `cy.pause({ log: false })`, parserOptions, errors },
  ],
})
