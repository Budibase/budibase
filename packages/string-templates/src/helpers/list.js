const externalHandlebars = require("./external")
const helperList = require("@budibase/handlebars-helpers")

let helpers = undefined

module.exports.getHelperList = () => {
  if (helpers) {
    return helpers
  }

  helpers = {}
  let constructed = []
  for (let collection of externalHandlebars.externalCollections) {
    constructed.push(helperList[collection]())
  }
  for (let collection of constructed) {
    for (let [key, func] of Object.entries(collection)) {
      // Handlebars injects the hbs options to the helpers by default. We are adding an empty {} as a last parameter to simulate it
      helpers[key] = (...props) => func(...props, {})
    }
  }
  for (let key of Object.keys(externalHandlebars.addedHelpers)) {
    helpers[key] = externalHandlebars.addedHelpers[key]
  }

  Object.freeze(helpers)
  return helpers
}
