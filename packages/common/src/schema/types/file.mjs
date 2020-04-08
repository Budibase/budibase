import { last, has, isString, intersection, isNull, isNumber } from "lodash/fp"
import {
  typeFunctions,
  parsedFailed,
  parsedSuccess,
  getDefaultExport,
} from "./typeHelpers"
import { switchCase, defaultCase, none, $, splitKey } from "../../common"

const illegalCharacters = "*?\\/:<>|\0\b\f\v"

export const isLegalFilename = filePath => {
  const fn = fileName(filePath)
  return (
    fn.length <= 255 &&
    intersection(fn.split(""))(illegalCharacters.split("")).length === 0 &&
    none(f => f === "..")(splitKey(filePath))
  )
}

const fileNothing = () => ({ relativePath: "", size: 0 })

const fileFunctions = typeFunctions({
  default: fileNothing,
})

const fileTryParse = v =>
  switchCase(
    [isValidFile, parsedSuccess],
    [isNull, () => parsedSuccess(fileNothing())],
    [defaultCase, parsedFailed]
  )(v)

const fileName = filePath => $(filePath, [splitKey, last])

const isValidFile = f =>
  !isNull(f) &&
  has("relativePath")(f) &&
  has("size")(f) &&
  isNumber(f.size) &&
  isString(f.relativePath) &&
  isLegalFilename(f.relativePath)

const options = {}

const typeConstraints = []

export default getDefaultExport(
  "file",
  fileTryParse,
  fileFunctions,
  options,
  typeConstraints,
  { relativePath: "some_file.jpg", size: 1000 },
  JSON.stringify
)
