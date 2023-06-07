const Helper = require("./Helper")
const { SafeString } = require("handlebars")
const externalHandlebars = require("./external")
const { processJS } = require("./javascript")
const {
  HelperFunctionNames,
  HelperFunctionBuiltin,
  LITERAL_MARKER,
} = require("./constants")
const { getHelperList } = require("./list")

const HTML_SWAPS = {
  "<": "&lt;",
  ">": "&gt;",
}

function isObject(value) {
  if (value == null || typeof value !== "object") {
    return false
  }
  return (
    value.toString() === "[object Object]" ||
    (value.length > 0 && typeof value[0] === "object")
  )
}

const HELPERS = [
  // external helpers
  new Helper(HelperFunctionNames.OBJECT, value => {
    return new SafeString(JSON.stringify(value))
  }),
  // javascript helper
  new Helper(HelperFunctionNames.JS, processJS, false),
  // this help is applied to all statements
  new Helper(HelperFunctionNames.ALL, (value, inputs) => {
    const { __opts } = inputs
    if (isObject(value)) {
      return new SafeString(JSON.stringify(value))
    }
    // null/undefined values produce bad results
    if (__opts && __opts.onlyFound && value == null) {
      return __opts.input
    }
    if (value == null || typeof value !== "string") {
      return value == null ? "" : value
    }
    if (value && value.string) {
      value = value.string
    }
    let text = value
    if (__opts && __opts.escapeNewlines) {
      text = value.replace(/\n/g, "\\n")
    }
    text = new SafeString(text.replace(/&amp;/g, "&"))
    if (text == null || typeof text !== "string") {
      return text
    }
    return text.replace(/[<>]/g, tag => {
      return HTML_SWAPS[tag] || tag
    })
  }),
  // adds a note for post-processor
  new Helper(HelperFunctionNames.LITERAL, value => {
    if (value === undefined) {
      return ""
    }
    const type = typeof value
    const outputVal = type === "object" ? JSON.stringify(value) : value
    return `{{${LITERAL_MARKER} ${type}-${outputVal}}}`
  }),
]

module.exports.HelperNames = () => {
  return Object.values(HelperFunctionNames).concat(
    HelperFunctionBuiltin,
    externalHandlebars.externalHelperNames
  )
}

module.exports.registerMinimum = handlebars => {
  for (let helper of HELPERS) {
    helper.register(handlebars)
  }
}

module.exports.registerAll = handlebars => {
  module.exports.registerMinimum(handlebars)
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

module.exports.getHelperList = getHelperList
