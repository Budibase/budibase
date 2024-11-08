const ALPHA_NUMERIC_REGEX = /^[A-Za-z0-9]+$/g

export const FIND_HBS_REGEX = /{{([^{].*?)}}/g
export const FIND_ANY_HBS_REGEX = /{?{{([^{].*?)}}}?/g
export const FIND_TRIPLE_HBS_REGEX = /{{{([^{].*?)}}}/g

const isJest = () => typeof jest !== "undefined"

export const isBackendService = () => {
  // We consider the tests for string-templates to be frontend, so that they
  // test the frontend JS functionality.
  if (isJest()) {
    return false
  }
  return typeof window === "undefined"
}

export const isJSAllowed = () => {
  return process && !process.env.NO_JS
}

// originally this could be done with a single regex using look behinds
// but safari does not support this feature
// original regex: /(?<!{){{[^{}]+}}(?!})/g
export const findDoubleHbsInstances = (string: string): string[] => {
  let copied = string
  const doubleRegex = new RegExp(FIND_HBS_REGEX)
  const regex = new RegExp(FIND_TRIPLE_HBS_REGEX)
  const tripleMatches = copied.match(regex)
  // remove triple braces
  if (tripleMatches) {
    tripleMatches.forEach((match: string) => {
      copied = copied.replace(match, "")
    })
  }
  const doubleMatches = copied.match(doubleRegex)
  return doubleMatches ? doubleMatches : []
}

export const isAlphaNumeric = (char: string) => {
  return char.match(ALPHA_NUMERIC_REGEX)
}

export const swapStrings = (
  string: string,
  start: number,
  length: number,
  swap: string
) => {
  return string.slice(0, start) + swap + string.slice(start + length)
}

export const removeHandlebarsStatements = (
  string: string,
  replacement = "Invalid binding"
) => {
  let regexp = new RegExp(FIND_HBS_REGEX)
  let matches = string.match(regexp)
  if (matches == null) {
    return string
  }
  for (let match of matches) {
    const idx = string.indexOf(match)
    string = swapStrings(string, idx, match.length, replacement)
  }
  return string
}

export const btoa = (plainText: string) => {
  return Buffer.from(plainText, "utf-8").toString("base64")
}

export const atob = (base64: string) => {
  return Buffer.from(base64, "base64").toString("utf-8")
}

export const prefixStrings = (
  baseString: string,
  strings: string[],
  prefix: string
) => {
  // Escape any special characters in the strings to avoid regex errors
  const escapedStrings = strings.map(str =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  )
  const regexPattern = new RegExp(`\\b(${escapedStrings.join("|")})\\b`, "g")
  return baseString.replace(regexPattern, `${prefix}$1`)
}
