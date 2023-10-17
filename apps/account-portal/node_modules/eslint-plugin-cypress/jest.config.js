const { defaults } = require('jest-config')

module.exports = {
  testMatch: ['**/tests/**/*.[jt]s?(x)'],
  testPathIgnorePatterns: [...defaults.testPathIgnorePatterns, '.history'],
}
