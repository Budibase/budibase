const { JS_EXT_TO_TREAT_AS_ESM, TS_EXT_TO_TREAT_AS_ESM } = require('../dist/constants')
const { createJestPreset } = require('../dist/presets/create-jest-preset')

module.exports = {
  get defaults() {
    return createJestPreset()
  },
  get defaultsESM() {
    return createJestPreset(false, { extensionsToTreatAsEsm: TS_EXT_TO_TREAT_AS_ESM })
  },
  get jsWithTs() {
    return createJestPreset(true)
  },
  get jsWithTsESM() {
    return createJestPreset(true, { extensionsToTreatAsEsm: [...JS_EXT_TO_TREAT_AS_ESM, ...TS_EXT_TO_TREAT_AS_ESM] })
  },
  get jsWithBabel() {
    return createJestPreset(false, {
      transform: {
        '^.+\\.jsx?$': 'babel-jest',
      },
    })
  },
  get jsWithBabelESM() {
    return createJestPreset(false, {
      extensionsToTreatAsEsm: [...JS_EXT_TO_TREAT_AS_ESM, ...TS_EXT_TO_TREAT_AS_ESM],
      transform: {
        '^.+\\.m?[j]sx?$': 'babel-jest',
      },
    })
  },
}
