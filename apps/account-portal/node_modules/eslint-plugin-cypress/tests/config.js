/* global describe, it, expect */
'use strict'

const globals = require('globals')
const config = require('../index.js')

describe('environments globals', () => {
  const env = config.environments.globals

  it('should not mutate globals', () => {
    expect(globals.browser).not.toHaveProperty('cy')
    expect(globals.mocha).not.toHaveProperty('cy')
  })

  it('should include other globals', () => {
    expect(env.globals).toEqual(expect.objectContaining(globals.browser))
    expect(env.globals).toEqual(expect.objectContaining(globals.mocha))
  })

  it('should include cypress globals', () => {
    expect(env.globals).toEqual(expect.objectContaining({
      cy: false,
      Cypress: false,
    }))
  })
})
