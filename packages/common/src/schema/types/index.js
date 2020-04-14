import { assign, merge } from "lodash"
import {
  map,
  isString,
  isNumber,
  isBoolean,
  isDate,
  keys,
  isObject,
  isArray,
  has,
} from "lodash/fp"
import { $ } from "../../common"
import { parsedSuccess } from "./typeHelpers"
import string from "./string"
import bool from "./bool"
import number from "./number"
import datetime from "./datetime"
import array from "./array"
import link from "./link"
import file from "./file"
import { BadRequestError } from "../../common/errors"

const allTypes = () => {
  const basicTypes = {
    string,
    number,
    datetime,
    bool,
    link,
    file,
  }

  const arrays = $(basicTypes, [
    keys,
    map(k => {
      const kvType = {}
      const concreteArray = array(basicTypes[k])
      kvType[concreteArray.name] = concreteArray
      return kvType
    }),
    types => assign({}, ...types),
  ])

  return merge({}, basicTypes, arrays)
}

export const all = allTypes()

export const getType = typeName => {
  if (!has(typeName)(all))
    throw new BadRequestError(`Do not recognise type ${typeName}`)
  return all[typeName]
}

export const getSampleFieldValue = field => getType(field.type).sampleValue

export const getNewFieldValue = field => getType(field.type).getNew(field)

export const safeParseField = (field, record) =>
  getType(field.type).safeParseField(field, record)

export const validateFieldParse = (field, record) =>
  has(field.name)(record)
    ? getType(field.type).tryParse(record[field.name])
    : parsedSuccess(undefined) // fields may be undefined by default

export const getDefaultOptions = type => getType(type).getDefaultOptions()

export const validateTypeConstraints = (field, record) =>
  getType(field.type).validateTypeConstraints(field, record)

export const detectType = value => {
  if (isString(value)) return string
  if (isBoolean(value)) return bool
  if (isNumber(value)) return number
  if (isDate(value)) return datetime
  if (isArray(value)) return array(detectType(value[0]))
  if (isObject(value) && has("key")(value) && has("value")(value)) return link
  if (isObject(value) && has("relativePath")(value) && has("size")(value))
    return file

  throw new BadRequestError(`cannot determine type: ${JSON.stringify(value)}`)
}
