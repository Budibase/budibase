export const getNewRecordValidationRule = (
  invalidField,
  messageWhenInvalid,
  expressionWhenValid
) => ({
  invalidField,
  messageWhenInvalid,
  expressionWhenValid,
})

export const commonRecordValidationRules = {
  fieldNotEmpty: fieldName =>
    getNewRecordValidationRule(
      fieldName,
      `${fieldName} is empty`,
      `record['${fieldName}'] && record['${fieldName}'].length > 0`
    ),

  fieldBetween: (fieldName, min, max) =>
    getNewRecordValidationRule(
      fieldName,
      `${fieldName} must be between ${min.toString()} and ${max.toString()}`,
      `record['${fieldName}'] >= ${min} &&  record['${fieldName}'] <= ${max} `
    ),

  fieldGreaterThan: (fieldName, min, max) =>
    getNewRecordValidationRule(
      fieldName,
      `${fieldName} must be greater than ${min.toString()} and ${max.toString()}`,
      `record['${fieldName}'] >= ${min}  `
    ),
}
