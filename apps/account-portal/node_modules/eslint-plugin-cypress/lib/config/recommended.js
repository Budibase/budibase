'use strict'

module.exports = {
  plugins: ['cypress'],
  env: {
    'cypress/globals': true,
  },
  rules: {
    'cypress/no-assigning-return-values': 'error',
    'cypress/no-unnecessary-waiting': 'error',
    'cypress/no-async-tests': 'error',
  },
}
