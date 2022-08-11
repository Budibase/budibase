const { pathsToModuleNameMapper } = require('../dist/config/paths-to-module-name-mapper')
const { createJestPreset } = require('../dist/presets/create-jest-preset')
const { mocked } = require('../dist/utils/testing')

module.exports = {
  get mocked() {
    if (!process.env.DISABLE_MOCKED_WARNING) {
      console.warn(
        '\n`mocked` util function is now deprecated and has been moved to Jest repository,' +
          ' see https://github.com/facebook/jest/pull/12089. In `ts-jest` v28.0.0, `mocked` function will be completely removed.' +
          ' Users are encouraged to use to Jest v27.4.0 or above to have `mocked` function available from `jest-mock`. ' +
          'One can disable this warning by setting environment variable process.env.DISABLE_MOCKED_WARNING=true\n'
      )
    }

    return mocked
  },
  get createJestPreset() {
    console.warn('ts-jest[main] (WARN) Replace any occurrences of "ts-jest/utils" with just "ts-jest".')

    return createJestPreset
  },
  get pathsToModuleNameMapper() {
    console.warn('ts-jest[main] (WARN) Replace any occurrences of "ts-jest/utils" with just "ts-jest".')

    return pathsToModuleNameMapper
  },
}
