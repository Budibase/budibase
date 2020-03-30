import { constant, isString, isNull, includes, isBoolean } from "lodash/fp"
import {
  typeFunctions,
  makerule,
  parsedSuccess,
  getDefaultExport,
} from "./typeHelpers"
import {
  switchCase,
  defaultCase,
  toBoolOrNull,
  toNumberOrNull,
  isSafeInteger,
  isArrayOfString,
} from "../common"

const stringFunctions = typeFunctions({
  default: constant(null),
})

const stringTryParse = switchCase(
  [isString, parsedSuccess],
  [isNull, parsedSuccess],
  [defaultCase, v => parsedSuccess(v.toString())]
)

const options = {
  maxLength: {
    defaultValue: null,
    isValid: n => n === null || (isSafeInteger(n) && n > 0),
    requirementDescription:
      "max length must be null (no limit) or a greater than zero integer",
    parse: toNumberOrNull,
  },
  values: {
    defaultValue: null,
    isValid: v =>
      v === null || (isArrayOfString(v) && v.length > 0 && v.length < 10000),
    requirementDescription:
      "'values' must be null (no values) or an array of at least one string",
    parse: s => s,
  },
  allowDeclaredValuesOnly: {
    defaultValue: false,
    isValid: isBoolean,
    requirementDescription: "allowDeclaredValuesOnly must be true or false",
    parse: toBoolOrNull,
  },
}

const typeConstraints = [
  makerule(
    async (val, opts) =>
      val === null || opts.maxLength === null || val.length <= opts.maxLength,
    (val, opts) => `value exceeds maximum length of ${opts.maxLength}`
  ),
  makerule(
    async (val, opts) =>
      val === null ||
      opts.allowDeclaredValuesOnly === false ||
      includes(val)(opts.values),
    val => `"${val}" does not exist in the list of allowed values`
  ),
]

export default getDefaultExport(
  "string",
  stringTryParse,
  stringFunctions,
  options,
  typeConstraints,
  "abcde",
  str => str
)
