const _ = require("lodash")
const ALPHA_NUMERIC_REGEX = /^[A-Za-z0-9]+$/g

module.exports.FIND_HBS_REGEX = /{{([^{}])+}}/g

module.exports.isAlphaNumeric = char => {
  return char.match(ALPHA_NUMERIC_REGEX)
}

module.exports.swapStrings = (string, start, length, swap) => {
  return string.slice(0, start) + swap + string.slice(start + length)
}

// removes null and undefined
module.exports.removeNull = obj => {
  obj = _(obj).omitBy(_.isUndefined).omitBy(_.isNull).value()
  for (let [key, value] of Object.entries(obj)) {
    // only objects
    if (typeof value === "object" && !Array.isArray(value)) {
      obj[key] = module.exports.removeNull(value)
    }
  }
  return obj
}

module.exports.addConstants = obj => {
  if (obj.now == null) {
    obj.now = (new Date()).toISOString()
  }
  return obj
}
