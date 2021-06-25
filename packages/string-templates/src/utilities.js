const ALPHA_NUMERIC_REGEX = /^[A-Za-z0-9]+$/g

module.exports.FIND_HBS_REGEX = /{{([^{].*?)}}/g

module.exports.isAlphaNumeric = char => {
  return char.match(ALPHA_NUMERIC_REGEX)
}

module.exports.swapStrings = (string, start, length, swap) => {
  return string.slice(0, start) + swap + string.slice(start + length)
}

module.exports.removeHandlebarsStatements = string => {
  let regexp = new RegExp(exports.FIND_HBS_REGEX)
  let matches = string.match(regexp)
  if (matches == null) {
    return string
  }
  for (let match of matches) {
    const idx = string.indexOf(match)
    string = exports.swapStrings(string, idx, match.length, "Invalid Binding")
  }
  return string
}
