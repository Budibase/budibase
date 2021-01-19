const Helper = require("./Helper")
const { SafeString } = require("handlebars")

const HTML_SWAPS = {
  "<": "&lt;",
  ">": "&gt;",
}

const HELPERS = [
  // external helpers
  new Helper("object", value => {
    return new SafeString(JSON.stringify(value))
  }),
  // this help is applied to all statements
  new Helper("all", value => {
    let text = unescape(value).replace(/&amp;/g, '&');
    if (text == null || typeof text !== "string") {
      return text
    }
    return text.replace(/[<>]/g, tag => {
      return HTML_SWAPS[tag] || tag
    })
  })
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
