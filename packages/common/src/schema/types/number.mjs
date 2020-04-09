import { constant, isNumber, isString, isNull } from "lodash/fp"
import {
  makerule,
  typeFunctions,
  parsedFailed,
  parsedSuccess,
  getDefaultExport,
} from "./typeHelpers"
import {
  switchCase,
  defaultCase,
  toNumberOrNull,
  isSafeInteger,
} from "../../common/index.mjs"

const numberFunctions = typeFunctions({
  default: constant(null),
})

const parseStringtoNumberOrNull = s => {
  const num = Number(s)
  return isNaN(num) ? parsedFailed(s) : parsedSuccess(num)
}

const numberTryParse = switchCase(
  [isNumber, parsedSuccess],
  [isString, parseStringtoNumberOrNull],
  [isNull, parsedSuccess],
  [defaultCase, parsedFailed]
)

const options = {
  maxValue: {
    defaultValue: Number.MAX_SAFE_INTEGER,
    isValid: isSafeInteger,
    requirementDescription: "must be a valid integer",
    parse: toNumberOrNull,
  },
  minValue: {
    defaultValue: 0 - Number.MAX_SAFE_INTEGER,
    isValid: isSafeInteger,
    requirementDescription: "must be a valid integer",
    parse: toNumberOrNull,
  },
  decimalPlaces: {
    defaultValue: 0,
    isValid: n => isSafeInteger(n) && n >= 0,
    requirementDescription: "must be a positive integer",
    parse: toNumberOrNull,
  },
}

const getDecimalPlaces = val => {
  const splitDecimal = val.toString().split(".")
  if (splitDecimal.length === 1) return 0
  return splitDecimal[1].length
}

const typeConstraints = [
  makerule(
    (val, opts) =>
      val === null || opts.minValue === null || val >= opts.minValue,
    (val, opts) =>
      `value (${val.toString()}) must be greater than or equal to ${
        opts.minValue
      }`
  ),
  makerule(
    (val, opts) =>
      val === null || opts.maxValue === null || val <= opts.maxValue,
    (val, opts) =>
      `value (${val.toString()}) must be less than or equal to ${
        opts.minValue
      } options`
  ),
  makerule(
    (val, opts) =>
      val === null || opts.decimalPlaces >= getDecimalPlaces(val),
    (val, opts) =>
      `value (${val.toString()}) must have ${
        opts.decimalPlaces
      } decimal places or less`
  ),
]

export default getDefaultExport(
  "number",
  numberTryParse,
  numberFunctions,
  options,
  typeConstraints,
  1,
  num => num.toString()
)
