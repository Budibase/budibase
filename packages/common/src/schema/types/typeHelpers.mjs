import { merge } from "lodash"
import { constant, isUndefined, has, mapValues, cloneDeep } from "lodash/fp"
import { isNotEmpty } from "../../common/index.mjs"

export const getSafeFieldParser = (tryParse, defaultValueFunctions) => (
  field,
  record
) => {
  if (has(field.name)(record)) {
    return getSafeValueParser(
      tryParse,
      defaultValueFunctions
    )(record[field.name])
  }
  return defaultValueFunctions[field.getUndefinedValue]()
}

export const getSafeValueParser = (
  tryParse,
  defaultValueFunctions
) => value => {
  const parsed = tryParse(value)
  if (parsed.success) {
    return parsed.value
  }
  return defaultValueFunctions.default()
}

export const getNewValue = (tryParse, defaultValueFunctions) => field => {
  const getInitialValue =
    isUndefined(field) || isUndefined(field.getInitialValue)
      ? "default"
      : field.getInitialValue

  return has(getInitialValue)(defaultValueFunctions)
    ? defaultValueFunctions[getInitialValue]()
    : getSafeValueParser(tryParse, defaultValueFunctions)(getInitialValue)
}

export const typeFunctions = specificFunctions =>
  merge(
    {
      value: constant,
      null: constant(null),
    },
    specificFunctions
  )

export const validateTypeConstraints = validationRules => async (
  field,
  record
) => {
  const fieldValue = record[field.name]
  const validateRule = async r =>
    !(await r.isValid(fieldValue, field.typeOptions))
      ? r.getMessage(fieldValue, field.typeOptions)
      : ""

  const errors = []
  for (const r of validationRules) {
    const err = await validateRule(r)
    if (isNotEmpty(err)) errors.push(err)
  }

  return errors
}

const getDefaultOptions = mapValues(v => v.defaultValue)

export const makerule = (isValid, getMessage) => ({ isValid, getMessage })
export const parsedFailed = val => ({ success: false, value: val })
export const parsedSuccess = val => ({ success: true, value: val })
export const getDefaultExport = (
  name,
  tryParse,
  functions,
  options,
  validationRules,
  sampleValue,
  stringify
) => ({
  getNew: getNewValue(tryParse, functions),
  safeParseField: getSafeFieldParser(tryParse, functions),
  safeParseValue: getSafeValueParser(tryParse, functions),
  tryParse,
  name,
  getDefaultOptions: () => getDefaultOptions(cloneDeep(options)),
  optionDefinitions: options,
  validateTypeConstraints: validateTypeConstraints(validationRules),
  sampleValue,
  stringify: val => (val === null || val === undefined ? "" : stringify(val)),
  getDefaultValue: functions.default,
})
