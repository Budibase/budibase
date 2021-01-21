const { HelperNames } = require("../helpers")
const {
  swapStrings,
  isAlphaNumeric,
  FIND_HBS_REGEX,
} = require("../utilities")

const PreprocessorNames = {
  SWAP_TO_DOT: "swap-to-dot-notation",
  HANDLE_SPACES: "handle-spaces-in-properties",
  FINALISE: "finalise",
}

class Preprocessor {
  constructor(name, fn) {
    this.name = name
    this.fn = fn
  }

  process(fullString, statement) {
    const output = this.fn(statement)
    const idx = fullString.indexOf(statement)
    return swapStrings(fullString, idx, statement.length, output)
  }
}

module.exports.processors = [
  new Preprocessor(PreprocessorNames.SWAP_TO_DOT, statement => {
    let startBraceIdx = statement.indexOf("[")
    let lastIdx = 0
    while (startBraceIdx !== -1) {
      // if the character previous to the literal specifier is alpha-numeric this should happen
      if (isAlphaNumeric(statement.charAt(startBraceIdx - 1))) {
        statement = swapStrings(statement, startBraceIdx + lastIdx, 1, ".[")
      }
      lastIdx = startBraceIdx + 1
      startBraceIdx = statement.substring(lastIdx + 1).indexOf("[")
    }
    return statement
  }),

  new Preprocessor(PreprocessorNames.HANDLE_SPACES, statement => {
    // exclude helpers and brackets, regex will only find double brackets
    const exclusions = HelperNames()
    // find all the parts split by spaces
    const splitBySpaces = statement
      .split(" ")
      .filter(el => el !== "{{" && el !== "}}")
    // remove braces if they are found and weren't spaced out
    splitBySpaces[0] = splitBySpaces[0].replace("{", "")
    splitBySpaces[splitBySpaces.length - 1] = splitBySpaces[
      splitBySpaces.length - 1
    ].replace("}", "")
    // remove the excluded elements
    const propertyParts = splitBySpaces.filter(
      part => exclusions.indexOf(part) === -1
    )
    // rebuild to get the full property
    const fullProperty = propertyParts.join(" ")
    // now work out the dot notation layers and split them up
    const propertyLayers = fullProperty.split(".")
    // find the layers which need to be wrapped and wrap them
    for (let layer of propertyLayers) {
      if (layer.indexOf(" ") !== -1) {
        statement = swapStrings(
          statement,
          statement.indexOf(layer),
          layer.length,
          `[${layer}]`
        )
      }
    }
    // remove the edge case of double brackets being entered (in-case user already has specified)
    return statement.replace(/\[\[/g, "[").replace(/]]/g, "]")
  }),

  new Preprocessor(Preprocessor.FINALISE, statement => {
    let insideStatement = statement.slice(2, statement.length - 2)
    if (insideStatement.charAt(0) === " ") {
      insideStatement = insideStatement.slice(1)
    }
    if (insideStatement.charAt(insideStatement.length - 1) === " ") {
      insideStatement = insideStatement.slice(0, insideStatement.length - 1)
    }
    const possibleHelper = insideStatement.split(" ")[0]
    if (HelperNames().some(option => possibleHelper === option)) {
      insideStatement = `(${insideStatement})`
    }
    return `{{ all ${insideStatement} }}`
  }),
]
