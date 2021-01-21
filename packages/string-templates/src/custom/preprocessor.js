const { HelperFunctions } = require("../helpers")
const {
  swapStrings,
  isAlphaNumeric,
  FIND_HBS_REGEX,
  includesAny,
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

const PROCESSORS = [
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
    const exclusions = HelperFunctions.concat(["{{", "}}"])
    // find all the parts split by spaces
    const splitBySpaces = statement.split(" ")
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
    if (includesAny(insideStatement, HelperFunctions)) {
      insideStatement = `(${insideStatement})`
    }
    return `{{ all ${insideStatement} }}`
  }),
]

/**
 * When running handlebars statements to execute on the context of the automation it possible user's may input handlebars
 * in a few different forms, some of which are invalid but are logically valid. An example of this would be the handlebars
 * statement "{{steps[0].revision}}" here it is obvious the user is attempting to access an array or object using array
 * like operators. These are not supported by handlebars and therefore the statement will fail. This function pre-processes will
 * the handlebars statement so it instead reads as "{{steps.0.revision}}" which is valid and will work. It may also be expanded
 * to include any other handlebars statement pre-process that has been deemed necessary for the system.
 *
 * @param {string} string The string which *may* contain handlebars statements, it is OK if it does not contain any.
 * @returns {string} The string that was input with processed up handlebars statements as required.
 */
module.exports.preprocess = string => {
  for (let processor of PROCESSORS) {
    // re-run search each time incase previous processor updated/removed a match
    let regex = new RegExp(FIND_HBS_REGEX)
    let matches = string.match(regex)
    if (matches == null) {
      continue
    }
    for (let match of matches) {
      string = processor.process(string, match)
    }
  }
  return string
}
