const Helper = require("./Helper")
const { SafeString } = require("handlebars")
const externalHandlebars = require("./external")
const { HelperFunctionNames, HelperFunctionBuiltin } = require("./constants")

const HTML_SWAPS = {
  "<": "&lt;",
  ">": "&gt;",
}

const HELPERS = [
  // external helpers
  new Helper(HelperFunctionNames.OBJECT, value => {
    return new SafeString(JSON.stringify(value))
  }),
  // this help is applied to all statements
  new Helper(HelperFunctionNames.ALL, value => {
    // null/undefined values produce bad results
    if (value == null) {
      return ""
    }
    let text = new SafeString(unescape(value).replace(/&amp;/g, "&"))
    if (text == null || typeof text !== "string") {
      return text
    }
    return text.replace(/[<>]/g, tag => {
      return HTML_SWAPS[tag] || tag
    })
  }),
]

module.exports.HelperNames = () => {
  return Object.values(HelperFunctionNames).concat(
    HelperFunctionBuiltin,
    externalHandlebars.externalHelperNames,
  )
}

module.exports.registerAll = handlebars => {
  for (let helper of HELPERS) {
    helper.register(handlebars)
  }
  // register imported helpers
  externalHandlebars.registerAll(handlebars)
}

module.exports.unregisterAll = handlebars => {
  for (let helper of HELPERS) {
    helper.unregister(handlebars)
  }
  // unregister all imported helpers
  externalHandlebars.unregisterAll(handlebars)
}
