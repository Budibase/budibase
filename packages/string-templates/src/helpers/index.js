const Helper = require("./Helper")
const { SafeString } = require("handlebars")

const HELPERS = [
  new Helper("object", value => {
    return new SafeString(JSON.stringify(value))
  }),
]

module.exports.registerAll = handlebars => {
  for (let helper of HELPERS) {
    helper.register(handlebars)
  }
}

module.exports.unregisterAll = handlebars => {
  for (let helper of HELPERS) {
    helper.unregister(handlebars)
  }
}
