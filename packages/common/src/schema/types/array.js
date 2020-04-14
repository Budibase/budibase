import { map, constant, isArray } from "lodash/fp"
import {
  typeFunctions,
  makerule,
  parsedFailed,
  getDefaultExport,
  parsedSuccess,
} from "./typeHelpers"
import {
  switchCase,
  defaultCase,
  toNumberOrNull,
  $$,
  isSafeInteger,
} from "../../common/index.js"

const arrayFunctions = () =>
  typeFunctions({
    default: constant([]),
  })

const mapToParsedArrary = type =>
  $$(
    map(i => type.safeParseValue(i)),
    parsedSuccess
  )

const arrayTryParse = type =>
  switchCase([isArray, mapToParsedArrary(type)], [defaultCase, parsedFailed])

const typeName = type => `array<${type}>`

const options = {
  maxLength: {
    defaultValue: 10000,
    isValid: isSafeInteger,
    requirementDescription: "must be a positive integer",
    parse: toNumberOrNull,
  },
  minLength: {
    defaultValue: 0,
    isValid: n => isSafeInteger(n) && n >= 0,
    requirementDescription: "must be a positive integer",
    parse: toNumberOrNull,
  },
}

const typeConstraints = [
  makerule(
    (val, opts) => val === null || val.length >= opts.minLength,
    (val, opts) => `must choose ${opts.minLength} or more options`
  ),
  makerule(
    (val, opts) => val === null || val.length <= opts.maxLength,
    (val, opts) => `cannot choose more than ${opts.maxLength} options`
  ),
]

export default type =>
  getDefaultExport(
    typeName(type.name),
    arrayTryParse(type),
    arrayFunctions(type),
    options,
    typeConstraints,
    [type.sampleValue],
    JSON.stringify
  )
