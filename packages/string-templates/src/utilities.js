const ALPHA_NUMERIC_REGEX = /^[A-Za-z0-9]+$/g

export const FIND_HBS_REGEX = /{{([^{].*?)}}/g
export const FIND_ANY_HBS_REGEX = /{?{{([^{].*?)}}}?/g
export const FIND_TRIPLE_HBS_REGEX = /{{{([^{].*?)}}}/g

export const isBackendService = () => {
  return typeof window === "undefined"
}

export const isJSAllowed = () => {
  return process && !process.env.NO_JS
}

// originally this could be done with a single regex using look behinds
// but safari does not support this feature
// original regex: /(?<!{){{[^{}]+}}(?!})/g
export const findDoubleHbsInstances = string => {
  let copied = string
  const doubleRegex = new RegExp(exports.FIND_HBS_REGEX)
  const regex = new RegExp(exports.FIND_TRIPLE_HBS_REGEX)
  const tripleMatches = copied.match(regex)
  // remove triple braces
  if (tripleMatches) {
    tripleMatches.forEach(match => {
      copied = copied.replace(match, "")
    })
  }
  const doubleMatches = copied.match(doubleRegex)
  return doubleMatches ? doubleMatches : []
}

export const isAlphaNumeric = char => {
  return char.match(ALPHA_NUMERIC_REGEX)
}

export const swapStrings = (string, start, length, swap) => {
  return string.slice(0, start) + swap + string.slice(start + length)
}

export const removeHandlebarsStatements = (
  string,
  replacement = "Invalid binding"
) => {
  let regexp = new RegExp(exports.FIND_HBS_REGEX)
  let matches = string.match(regexp)
  if (matches == null) {
    return string
  }
  for (let match of matches) {
    const idx = string.indexOf(match)
    string = exports.swapStrings(string, idx, match.length, replacement)
  }
  return string
}

export const btoa = plainText => {
  return Buffer.from(plainText, "utf-8").toString("base64")
}

export const atob = base64 => {
  return Buffer.from(base64, "base64").toString("utf-8")
}
