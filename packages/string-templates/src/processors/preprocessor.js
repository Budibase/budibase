const { HelperNames } = require("../helpers")
const { swapStrings, isAlphaNumeric } = require("../utilities")

const FUNCTION_CASES = ["#", "else", "/"]

const PreprocessorNames = {
  SWAP_TO_DOT: "swap-to-dot-notation",
  FIX_FUNCTIONS: "fix-functions",
  FINALISE: "finalise",
}

/* eslint-disable no-unused-vars */
class Preprocessor {
  constructor(name, fn) {
    this.name = name
    this.fn = fn
  }

  process(fullString, statement, opts) {
    const output = this.fn(statement, opts)
    const idx = fullString.indexOf(statement)
    return swapStrings(fullString, idx, statement.length, output)
  }
}

module.exports.processors = [
  new Preprocessor(PreprocessorNames.SWAP_TO_DOT, statement => {
    let startBraceIdx = statement.indexOf("[")
    let lastIdx = 0
    while (startBraceIdx !== -1) {
      // if the character previous to the literal specifier is alphanumeric this should happen
      if (isAlphaNumeric(statement.charAt(startBraceIdx - 1))) {
        statement = swapStrings(statement, startBraceIdx + lastIdx, 1, ".[")
      }
      lastIdx = startBraceIdx + 1
      const nextBraceIdx = statement.substring(lastIdx + 1).indexOf("[")
      startBraceIdx = nextBraceIdx > 0 ? lastIdx + 1 + nextBraceIdx : -1
    }
    return statement
  }),

  new Preprocessor(PreprocessorNames.FIX_FUNCTIONS, statement => {
    for (let specialCase of FUNCTION_CASES) {
      const toFind = `{ ${specialCase}`,
        replacement = `{${specialCase}`
      statement = statement.replace(new RegExp(toFind, "g"), replacement)
    }
    return statement
  }),

  new Preprocessor(PreprocessorNames.FINALISE, (statement, opts) => {
    const noHelpers = opts && opts.noHelpers
    let insideStatement = statement.slice(2, statement.length - 2)
    if (insideStatement.charAt(0) === " ") {
      insideStatement = insideStatement.slice(1)
    }
    if (insideStatement.charAt(insideStatement.length - 1) === " ") {
      insideStatement = insideStatement.slice(0, insideStatement.length - 1)
    }
    const possibleHelper = insideStatement.split(" ")[0]
    // function helpers can't be wrapped
    for (let specialCase of FUNCTION_CASES) {
      if (possibleHelper.includes(specialCase)) {
        return statement
      }
    }
    const testHelper = possibleHelper.trim().toLowerCase()
    if (
      !noHelpers &&
      HelperNames().some(option => testHelper === option.toLowerCase())
    ) {
      insideStatement = `(${insideStatement})`
    }
    return `{{ all ${insideStatement} }}`
  }),
]

module.exports.PreprocessorNames = PreprocessorNames
