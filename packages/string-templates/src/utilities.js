const ALPHA_NUMERIC_REGEX = /^[A-Za-z0-9]+$/g

module.exports.FIND_HBS_REGEX = /{{[^}}]*}}/g

module.exports.isAlphaNumeric = (char) => {
  return char.match(ALPHA_NUMERIC_REGEX)
}

module.exports.swapStrings = (string, start, length, swap) => {
  return string.slice(0, start) + swap + string.slice(start + length)
}

module.exports.includesAny = (string, options) => {
  return options.some(option => string.includes(option))
}
