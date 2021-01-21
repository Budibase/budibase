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
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => value != null)
      .map(([key, value]) => [
        key,
        value === Object(value) ? module.exports.removeNull(value) : value,
      ])
  )
}
