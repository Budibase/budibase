import { isString, isUndefined, isNull } from "lodash/fp"
import { typeFunctions, parsedSuccess, getDefaultExport } from "./typeHelpers"
import {
  switchCase,
  defaultCase,
  isNonEmptyString,
} from "../../common/index.js"

const linkNothing = () => ""

const linkFunctions = typeFunctions({
  default: linkNothing,
})

const linkTryParse = v =>
  switchCase(
    [isString, s => parsedSuccess(s)],
    [isNull, () => parsedSuccess(linkNothing())],
    [isUndefined, () => parsedSuccess(linkNothing())],
    [defaultCase, s => parsedSuccess(s.toString())]
  )(v)

const options = {
  modelId: {
    defaultValue: "",
    isValid: isNonEmptyString,
    requirementDescription: "must choose a model",
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
  "abcd1234",
  JSON.stringify
)
