'use strict'

const rule = require('../../../lib/rules/assertion-before-screenshot')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 6 }

ruleTester.run('assertion-before-screenshot', rule, {
  valid: [
    { code: 'cy.get(".some-element"); cy.screenshot();', parserOptions },
    { code: 'cy.get(".some-element").should("exist").screenshot();', parserOptions },
    { code: 'cy.get(".some-element").should("exist").screenshot().click()', parserOptions, errors },
    { code: 'cy.get(".some-element").should("exist"); if(true) cy.screenshot();', parserOptions },
    { code: 'if(true) { cy.get(".some-element").should("exist"); cy.screenshot(); }', parserOptions },
    { code: 'cy.get(".some-element").should("exist"); if(true) { cy.screenshot(); }', parserOptions },
    { code: 'const a = () => { cy.get(".some-element").should("exist"); cy.screenshot(); }', parserOptions, errors },
    { code: 'cy.get(".some-element").should("exist").and("be.visible"); cy.screenshot();', parserOptions },
    { code: 'cy.get(".some-element").contains("Text"); cy.screenshot();', parserOptions },
  ],

  invalid: [
    { code: 'cy.screenshot()', parserOptions, errors },
    { code: 'cy.visit("somepage"); cy.screenshot();', parserOptions, errors },
    { code: 'cy.custom(); cy.screenshot()', parserOptions, errors },
    { code: 'cy.get(".some-element").click(); cy.screenshot()', parserOptions, errors },
    { code: 'cy.get(".some-element").click().screenshot()', parserOptions, errors },
    { code: 'if(true) { cy.get(".some-element").click(); cy.screenshot(); }', parserOptions, errors },
    { code: 'cy.get(".some-element").click(); if(true) { cy.screenshot(); }', parserOptions, errors },
    { code: 'cy.get(".some-element"); function a() { cy.screenshot(); }', parserOptions, errors },
    { code: 'cy.get(".some-element"); const a = () => { cy.screenshot(); }', parserOptions, errors },
  ],
})
