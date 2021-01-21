const helpers = require("handlebars-helpers")
const dateHelper = require("helper-date")
const { HelperFunctionBuiltin } = require("./constants")

/**
 * full list of supported helpers can be found here:
 * https://github.com/helpers/handlebars-helpers
 */

const EXTERNAL_FUNCTION_COLLECTIONS = [
  "math",
  "array",
  "number",
  "url",
  "string",
  "markdown",
]

const DATE_NAME = "date"

exports.registerAll = handlebars => {
  handlebars.registerHelper(DATE_NAME, dateHelper)
  let externalNames = []
  for (let collection of EXTERNAL_FUNCTION_COLLECTIONS) {
    // collect information about helper
    let hbsHelperInfo = helpers[collection]()
    for (let entry of Object.entries(hbsHelperInfo)) {
      const name = entry[0]
      // skip built in functions and ones seen already
      if (
        HelperFunctionBuiltin.indexOf(name) !== -1 ||
        externalNames.indexOf(name) !== -1
      ) {
        continue
      }
      externalNames.push(name)
    }
    // attach it to our handlebars instance
    helpers[collection]({
      handlebars,
    })
  }
  // add date external functionality
  externalNames.push(DATE_NAME)
  exports.externalHelperNames = externalNames
}

exports.unregisterAll = handlebars => {
  handlebars.unregisterHelper(DATE_NAME)
  for (let name of module.exports.externalHelperNames) {
    handlebars.unregisterHelper(name)
  }
  exports.externalHelperNames = []
}

exports.externalHelperNames = []
