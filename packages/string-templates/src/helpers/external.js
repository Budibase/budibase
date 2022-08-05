const helpers = require("@budibase/handlebars-helpers")
const { date, duration } = require("./date")
const { HelperFunctionBuiltin } = require("./constants")

/**
 * full list of supported helpers can be found here:
 * https://github.com/Budibase/handlebars-helpers
 */

const EXTERNAL_FUNCTION_COLLECTIONS = [
  "math",
  "array",
  "number",
  "url",
  "string",
  "comparison",
  "object",
  "regex",
]

const ADDED_HELPERS = {
  date: date,
  duration: duration,
}

exports.externalCollections = EXTERNAL_FUNCTION_COLLECTIONS
exports.addedHelpers = ADDED_HELPERS

exports.registerAll = handlebars => {
  for (let [name, helper] of Object.entries(ADDED_HELPERS)) {
    handlebars.registerHelper(name, helper)
  }
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
  exports.externalHelperNames = externalNames.concat(Object.keys(ADDED_HELPERS))
}

exports.unregisterAll = handlebars => {
  for (let name of Object.keys(ADDED_HELPERS)) {
    handlebars.unregisterHelper(name)
  }
  for (let name of module.exports.externalHelperNames) {
    handlebars.unregisterHelper(name)
  }
  exports.externalHelperNames = []
}

exports.externalHelperNames = []
