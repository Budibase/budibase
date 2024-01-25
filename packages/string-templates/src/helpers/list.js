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
      helpers[key] = func
    }
  }
  for (let key of Object.keys(externalHandlebars.addedHelpers)) {
    helpers[key] = externalHandlebars.addedHelpers[key]
  }

  helpers = adjustJsHelpers(helpers)
  Object.freeze(helpers)
  return helpers
}

function adjustJsHelpers(helpers) {
  const result = { ...helpers }

  result.avg = function (...params) {
    return helpers.avg(...params, {})
  }
  return result
}
