import { map, reduce, filter, isEmpty, flatten, each } from "lodash/fp"
import { compileCode } from "../common/compileCode.mjs"
import _ from "lodash"
import {
  validateFieldParse,
  validateTypeConstraints,
} from "../schema/types/index.mjs"
import { $, isNonEmptyString } from "../common/index.mjs"

const fieldParseError = (fieldName, value) => ({
  fields: [fieldName],
  message: `Could not parse field ${fieldName}:${value}`,
})

const validateAllFieldParse = (record, model) =>
  $(model.fields, [
    map(f => ({ name: f.name, parseResult: validateFieldParse(f, record) })),
    reduce((errors, f) => {
      if (f.parseResult.success) return errors
      errors.push(fieldParseError(f.name, f.parseResult.value))
      return errors
    }, []),
  ])

const validateAllTypeConstraints = (record, model) => {
  const errors = []
  for (const field of model.fields) {
    $(validateTypeConstraints(field, record), [
      filter(isNonEmptyString),
      map(m => ({ message: m, fields: [field.name] })),
      each(e => errors.push(e)),
    ])
  }
  return errors
}

const runRecordValidationRules = (record, model) => {
  const runValidationRule = rule => {
    const isValid = compileCode(rule.expressionWhenValid)
    const expressionContext = { record }
    return isValid(expressionContext)
      ? { valid: true }
      : {
          valid: false,
          fields: rule.invalidFields,
          message: rule.messageWhenInvalid,
        }
  }

  return $(model.validationRules, [
    map(runValidationRule),
    flatten,
    filter(r => r.valid === false),
    map(r => ({ fields: r.fields, message: r.message })),
  ])
}

export const validateRecord = (schema, record) => {
  const model = schema.findModel(record._modelId)
  const fieldParseFails = validateAllFieldParse(record, model)

  // non parsing would cause further issues - exit here
  if (!isEmpty(fieldParseFails)) {
    return { isValid: false, errors: fieldParseFails }
  }

  const recordValidationRuleFails = runRecordValidationRules(record, model)
  const typeContraintFails = validateAllTypeConstraints(record, model)

  if (
    isEmpty(fieldParseFails) &&
    isEmpty(recordValidationRuleFails) &&
    isEmpty(typeContraintFails)
  ) {
    return { isValid: true, errors: [] }
  }

  return {
    isValid: false,
    errors: _.union(
      fieldParseFails,
      typeContraintFails,
      recordValidationRuleFails
    ),
  }
}
