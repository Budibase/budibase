import { constant, isBoolean, isNull } from "lodash/fp"
import {
  typeFunctions,
  makerule,
  parsedFailed,
  parsedSuccess,
  getDefaultExport,
} from "./typeHelpers"
import {
  switchCase,
  defaultCase,
  isOneOf,
  toBoolOrNull,
} from "../../common/index.js"

const boolFunctions = typeFunctions({
  default: constant(null),
})

const boolTryParse = switchCase(
  [isBoolean, parsedSuccess],
  [isNull, parsedSuccess],
  [isOneOf("true", "1", "yes", "on"), () => parsedSuccess(true)],
  [isOneOf("false", "0", "no", "off"), () => parsedSuccess(false)],
  [defaultCase, parsedFailed]
)

const options = {
  allowNulls: {
    defaultValue: true,
    isValid: isBoolean,
    requirementDescription: "must be a true or false",
    parse: toBoolOrNull,
  },
}

const typeConstraints = [
  makerule(
    (val, opts) => opts.allowNulls === true || val !== null,
    () => "field cannot be null"
  ),
]

export default getDefaultExport(
  "bool",
  boolTryParse,
  boolFunctions,
  options,
  typeConstraints,
  true,
  JSON.stringify
)
