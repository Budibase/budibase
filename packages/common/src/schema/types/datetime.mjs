import { constant, isDate, isString, isNull } from "lodash/fp"
import {
  makerule,
  typeFunctions,
  parsedFailed,
  parsedSuccess,
  getDefaultExport,
} from "./typeHelpers"
import { switchCase, defaultCase, toDateOrNull } from "../../common"

const dateFunctions = typeFunctions({
  default: constant(null),
  now: () => new Date(),
})

const isValidDate = d => d instanceof Date && !isNaN(d)

const parseStringToDate = s =>
  switchCase(
    [isValidDate, parsedSuccess],
    [defaultCase, parsedFailed]
  )(new Date(s))

const isNullOrEmpty = d => isNull(d) || (d || "").toString() === ""

const isDateOrEmpty = d => isDate(d) || isNullOrEmpty(d)

const dateTryParse = switchCase(
  [isDateOrEmpty, parsedSuccess],
  [isString, parseStringToDate],
  [defaultCase, parsedFailed]
)

const options = {
  maxValue: {
    defaultValue: null,
    //defaultValue: new Date(32503680000000),
    isValid: isDateOrEmpty,
    requirementDescription: "must be a valid date",
    parse: toDateOrNull,
  },
  minValue: {
    defaultValue: null,
    //defaultValue: new Date(-8520336000000),
    isValid: isDateOrEmpty,
    requirementDescription: "must be a valid date",
    parse: toDateOrNull,
  },
}

const typeConstraints = [
  makerule(
    async (val, opts) =>
      val === null || isNullOrEmpty(opts.minValue) || val >= opts.minValue,
    (val, opts) =>
      `value (${val.toString()}) must be greater than or equal to ${
        opts.minValue
      }`
  ),
  makerule(
    async (val, opts) =>
      val === null || isNullOrEmpty(opts.maxValue) || val <= opts.maxValue,
    (val, opts) =>
      `value (${val.toString()}) must be less than or equal to ${
        opts.minValue
      } options`
  ),
]

export default getDefaultExport(
  "datetime",
  dateTryParse,
  dateFunctions,
  options,
  typeConstraints,
  new Date(1984, 4, 1),
  date => JSON.stringify(date).replace(new RegExp('"', "g"), "")
)
