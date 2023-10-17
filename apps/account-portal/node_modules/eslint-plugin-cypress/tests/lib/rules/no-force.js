'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-force')

const RuleTester = require('eslint').RuleTester

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 2018 }

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let ruleTester = new RuleTester()

ruleTester.run('no-force', rule, {

  valid: [
    { code: `cy.get('button').click()`, parserOptions },
    { code: `cy.get('button').click({multiple: true})`, parserOptions },
    { code: `cy.get('button').dblclick()`, parserOptions },
    { code: `cy.get('input').type('somth')`, parserOptions },
    { code: `cy.get('input').type('somth', {anyoption: true})`, parserOptions },
    { code: `cy.get('input').trigger('click', {anyoption: true})`, parserOptions },
    { code: `cy.get('input').rightclick({anyoption: true})`, parserOptions },
    { code: `cy.get('input').check()`, parserOptions },
    { code: `cy.get('input').select()`, parserOptions },
    { code: `cy.get('input').focus()`, parserOptions },
    { code: `cy.document().trigger("keydown", { ...event })`, parserOptions },
  ],

  invalid: [
    { code: `cy.get('button').click({force: true})`, parserOptions, errors },
    { code: `cy.get('button').dblclick({force: true})`, parserOptions, errors },
    { code: `cy.get('input').type('somth', {force: true})`, parserOptions, errors },
    { code: `cy.get('div').find('.foo').type('somth', {force: true})`, parserOptions, errors },
    { code: `cy.get('div').find('.foo').find('.bar').click({force: true})`, parserOptions, errors },
    { code: `cy.get('div').find('.foo').find('.bar').trigger('change', {force: true})`, parserOptions, errors },
    { code: `cy.get('input').trigger('click', {force: true})`, parserOptions, errors },
    { code: `cy.get('input').rightclick({force: true})`, parserOptions, errors },
    { code: `cy.get('input').check({force: true})`, parserOptions, errors },
    { code: `cy.get('input').select({force: true})`, parserOptions, errors },
    { code: `cy.get('input').focus({force: true})`, parserOptions, errors },
  ],
})
