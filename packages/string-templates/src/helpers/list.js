const externalHandlebars = require("./external")
const helperList = require("@budibase/handlebars-helpers")

module.exports.getHelperList = () => {
  let constructed = []
  for (let collection of externalHandlebars.externalCollections) {
    constructed.push(helperList[collection]())
  }
  const fullMap = {}
  for (let collection of constructed) {
    for (let [key, func] of Object.entries(collection)) {
      fullMap[key] = func
    }
  }
  for (let key of Object.keys(externalHandlebars.addedHelpers)) {
    fullMap[key] = externalHandlebars.addedHelpers[key]
  }
  return fullMap
}
