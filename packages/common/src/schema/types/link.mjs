import { isString, isObjectLike, isNull, has } from "lodash/fp"
import {
  typeFunctions,
  parsedSuccess,
  getDefaultExport,
  parsedFailed,
} from "./typeHelpers"
import {
  switchCase,
  defaultCase,
  isNonEmptyString,
  isArrayOfString,
} from "../../common/index.mjs"

const linkNothing = () => ({ key: "" })

const linkFunctions = typeFunctions({
  default: linkNothing,
})

const hasStringValue = (ob, path) => has(path)(ob) && isString(ob[path])

const isObjectWithKey = v => isObjectLike(v) && hasStringValue(v, "key")

const tryParseFromString = s => {
  try {
    const asObj = JSON.parse(s)
    if (isObjectWithKey) {
      return parsedSuccess(asObj)
    }
  } catch (_) {
    // EMPTY
  }

  return parsedFailed(s)
}

const linkTryParse = v =>
  switchCase(
    [isObjectWithKey, parsedSuccess],
    [isString, tryParseFromString],
    [isNull, () => parsedSuccess(linkNothing())],
    [defaultCase, parsedFailed]
  )(v)

const options = {
  indexNodeKey: {
    defaultValue: null,
    isValid: isNonEmptyString,
    requirementDescription: "must be a non-empty string",
    parse: s => s,
  },
  displayValue: {
    defaultValue: "",
    isValid: isNonEmptyString,
    requirementDescription: "must be a non-empty string",
    parse: s => s,
  },
  reverseIndexNodeKeys: {
    defaultValue: null,
    isValid: v => isArrayOfString(v) && v.length > 0,
    requirementDescription: "must be a non-empty array of strings",
    parse: s => s,
  },
}

const typeConstraints = []

export default getDefaultExport(
  "link",
  linkTryParse,
  linkFunctions,
  options,
  typeConstraints,
  { key: "key", value: "value" },
  JSON.stringify
)
