import { HelperNames } from "../helpers"
import { swapStrings, isAlphaNumeric } from "../utilities"

const FUNCTION_CASES = ["#", "else", "/"]

export const PreprocessorNames = {
  SWAP_TO_DOT: "swap-to-dot-notation",
  FIX_FUNCTIONS: "fix-functions",
  FINALISE: "finalise",
  NORMALIZE_SPACES: "normalize-spaces",
}

class Preprocessor {
  name: string
  private fn: any

  constructor(name: string, fn: any) {
    this.name = name
    this.fn = fn
  }

  process(fullString: string, statement: string, opts: Object) {
    const output = this.fn(statement, opts)
    const idx = fullString.indexOf(statement)
    return swapStrings(fullString, idx, statement.length, output)
  }
}

export const processors = [
  new Preprocessor(PreprocessorNames.SWAP_TO_DOT, (statement: string) => {
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

  new Preprocessor(PreprocessorNames.FIX_FUNCTIONS, (statement: string) => {
    for (let specialCase of FUNCTION_CASES) {
      const toFind = `{ ${specialCase}`,
        replacement = `{${specialCase}`
      statement = statement.replace(new RegExp(toFind, "g"), replacement)
    }
    return statement
  }),

  new Preprocessor(PreprocessorNames.NORMALIZE_SPACES, (statement: string) => {
    return statement.replace(/{{(\s{2,})/g, "{{ ")
  }),
  new Preprocessor(
    PreprocessorNames.FINALISE,
    (statement: string, opts: { noHelpers: any }) => {
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
    }
  ),
]
