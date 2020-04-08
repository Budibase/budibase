import { isString, isObjectLike, isNull, has, isEmpty } from "lodash/fp"
import {
  typeFunctions,
  makerule,
  parsedSuccess,
  getDefaultExport,
  parsedFailed,
} from "./typeHelpers"
import {
  switchCase,
  defaultCase,
  isNonEmptyString,
  isArrayOfString,
} from "../../common"

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

const isEmptyString = s => isString(s) && isEmpty(s)

const ensurelinkExists = async (val, opts, context) =>
  isEmptyString(val.key) || (await context.linkExists(opts, val.key))

const typeConstraints = [
  makerule(
    ensurelinkExists,
    (val, opts) =>
      `"${val[opts.displayValue]}" does not exist in options list (key: ${
        val.key
      })`
  ),
]

export default getDefaultExport(
  "link",
  linkTryParse,
  linkFunctions,
  options,
  typeConstraints,
  { key: "key", value: "value" },
  JSON.stringify
)
