import { isNumber, isBoolean, defaultCase } from "lodash/fp"
import { switchCase } from "../common"

export const getNewRecordValidationRule = (
  invalidFields,
  messageWhenInvalid,
  expressionWhenValid
) => ({
  invalidFields,
  messageWhenInvalid,
  expressionWhenValid,
})

const getStaticValue = switchCase(
  [isNumber, v => v.toString()],
  [isBoolean, v => v.toString()],
  [defaultCase, v => `'${v}'`]
)

export const commonRecordValidationRules = {
  fieldNotEmpty: fieldName =>
    getNewRecordValidationRule(
      [fieldName],
      `${fieldName} is empty`,
      `!_.isEmpty(record['${fieldName}'])`
    ),

  fieldBetween: (fieldName, min, max) =>
    getNewRecordValidationRule(
      [fieldName],
      `${fieldName} must be between ${min.toString()} and ${max.toString()}`,
      `record['${fieldName}'] >= ${getStaticValue(
        min
      )} &&  record['${fieldName}'] <= ${getStaticValue(max)} `
    ),

  fieldGreaterThan: (fieldName, min, max) =>
    getNewRecordValidationRule(
      [fieldName],
      `${fieldName} must be greater than ${min.toString()} and ${max.toString()}`,
      `record['${fieldName}'] >= ${getStaticValue(min)}  `
    ),
}

export const addRecordValidationRule = recordNode => rule =>
  recordNode.validationRules.push(rule)
