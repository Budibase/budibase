import dayjs from "dayjs"
import { Helpers } from "@budibase/bbui"
import {
  FieldConstraints,
  FieldType,
  Table,
  UIFieldValidationRule,
} from "@budibase/types"

/**
 * Creates a validation function from a combination of schema-level constraints
 * and custom validation rules
 * @param schemaConstraints any schema level constraints from the datasource
 * @param customRules any custom validation rules
 * @param field the field name we are evaluating
 * @param definition the definition of the datasource we are evaluating
 * @returns {function} a validator function which accepts test values
 */
export const createValidatorFromConstraints = (
  schemaConstraints: FieldConstraints | null | undefined,
  customRules: UIFieldValidationRule[],
  field: string,
  definition: Table | undefined
) => {
  let rules: UIFieldValidationRule[] = []

  // Convert schema constraints into validation rules
  if (schemaConstraints) {
    // Required constraint
    if (
      field === definition?.primaryDisplay ||
      (schemaConstraints.presence as any)?.allowEmpty === false ||
      schemaConstraints.presence === true
    ) {
      rules.push({
        type: schemaConstraints.type == "array" ? "array" : "string",
        constraint: "required",
        error: "Required",
      })
    }

    // String length constraint
    if (exists(schemaConstraints.length?.maximum)) {
      const length = schemaConstraints.length.maximum
      rules.push({
        type: "string",
        constraint: "maxLength",
        value: length,
        error: `Maximum length is ${length}`,
      })
    }

    // Min / max number constraint
    if (exists(schemaConstraints.numericality?.greaterThanOrEqualTo)) {
      const min = schemaConstraints.numericality.greaterThanOrEqualTo
      rules.push({
        type: "number",
        constraint: "minValue",
        value: min,
        error: `Minimum value is ${min}`,
      })
    }
    if (exists(schemaConstraints.numericality?.lessThanOrEqualTo)) {
      const max = schemaConstraints.numericality.lessThanOrEqualTo
      rules.push({
        type: "number",
        constraint: "maxValue",
        value: max,
        error: `Maximum value is ${max}`,
      })
    }

    // Inclusion constraint
    if (
      exists(schemaConstraints.inclusion) &&
      schemaConstraints.type !== "array"
    ) {
      const options = schemaConstraints.inclusion || []
      rules.push({
        type: "string",
        constraint: "inclusion",
        value: options,
        error: "Invalid value",
      })
    }

    // Date constraint
    if (exists(schemaConstraints.datetime?.earliest)) {
      const limit = schemaConstraints.datetime.earliest
      const limitString = Helpers.getDateDisplayValue(dayjs(limit))
      rules.push({
        type: "datetime",
        constraint: "minValue",
        value: limit,
        error: `Earliest date is ${limitString}`,
      })
    }
    if (exists(schemaConstraints.datetime?.latest)) {
      const limit = schemaConstraints.datetime.latest
      const limitString = Helpers.getDateDisplayValue(dayjs(limit))
      rules.push({
        type: "datetime",
        constraint: "maxValue",
        value: limit,
        error: `Latest date is ${limitString}`,
      })
    }
  }

  // Add custom validation rules
  rules = rules.concat(customRules || [])

  // Evaluate each constraint
  return (value: any) => {
    for (let rule of rules) {
      const error = evaluateRule(rule, value)
      if (error) {
        return error
      }
    }
    return null
  }
}

/**
 * Evaluates a validation rule against a value and optionally returns
 * an error if the validation fails.
 * @param rule the rule object to evaluate
 * @param value the value to validate against
 * @returns {null|*} an error if validation fails or null if it passes
 */
const evaluateRule = (rule: UIFieldValidationRule, value: any) => {
  if (!rule) {
    return null
  }

  // Determine the correct handler for this rule
  const handler = handlerMap[rule.constraint]
  if (!handler) {
    return null
  }

  // Coerce input value into correct type
  value = parseType(value, rule.type)

  // Evaluate the rule
  const pass = handler(value, rule)
  return pass ? null : rule.error || "Error"
}

/**
 * Parses a value to the specified type so that values are always compared
 * in the same format.
 * @param value the value to parse
 * @param type the type to parse
 * @returns {boolean|string|*|number|null|array} the parsed value, or null if invalid
 */
const parseType = (value: any, type: `${FieldType}`) => {
  // Treat nulls or empty strings as null
  if (!exists(value) || !type) {
    return null
  }

  // Parse as string
  if (type === FieldType.STRING) {
    if (typeof value === "string" || Array.isArray(value)) {
      return value
    }
    if (value.length === 0) {
      return null
    }
    return `${value}`
  }

  // Parse as number
  if (type === FieldType.NUMBER) {
    if (isNaN(value)) {
      return null
    }
    return parseFloat(value)
  }

  // Parse as date
  if (type === FieldType.DATETIME) {
    if (value instanceof Date) {
      return value.getTime()
    }
    const time = isNaN(value) ? Date.parse(value) : new Date(value).getTime()
    return isNaN(time) ? null : time
  }

  // Parse as boolean
  if (type === FieldType.BOOLEAN) {
    if (typeof value === "string") {
      return value.toLowerCase() === "true"
    }
    return value === true
  }

  // Parse attachments, treating no elements as null
  if (type === FieldType.ATTACHMENTS) {
    if (!Array.isArray(value) || !value.length) {
      return null
    }
    return value
  }

  // Parse attachment/signature single, treating no key as null
  if (
    type === FieldType.ATTACHMENT_SINGLE ||
    type === FieldType.SIGNATURE_SINGLE
  ) {
    if (!value?.key) {
      return null
    }
    return value
  }

  // Parse links, treating no elements as null
  if (type === FieldType.LINK) {
    if (!Array.isArray(value) || !value.length) {
      return null
    }
    return value
  }

  // Parse array, treating no elements as null
  if (type === FieldType.ARRAY) {
    if (!Array.isArray(value) || !value.length) {
      return null
    }
    return value
  }

  // For JSON we don't touch the value at all as we want to verify it in its
  // raw form
  if (type === FieldType.JSON) {
    return value
  }

  // If some unknown type, treat as null to avoid breaking validators
  return null
}

// Evaluates a required constraint
const requiredHandler = (value: any) => {
  return value != null
}

// Evaluates a min length constraint
const minLengthHandler = (value: any, rule: UIFieldValidationRule) => {
  const limit = parseType(rule.value, "number")
  return value == null || value.length >= limit
}

// Evaluates a max length constraint
const maxLengthHandler = (value: any, rule: UIFieldValidationRule) => {
  const limit = parseType(rule.value, "number")
  return value == null || value.length <= limit
}

// Evaluates a max file size (MB) constraint
const maxFileSizeHandler = (value: any, rule: UIFieldValidationRule) => {
  const limit = parseType(rule.value, "number")
  const check = (attachment: { size: number }) =>
    attachment.size / 1000000 > limit
  return value == null || !(value?.key ? check(value) : value.some(check))
}

// Evaluates a max total upload size (MB) constraint
const maxUploadSizeHandler = (value: any, rule: UIFieldValidationRule) => {
  const limit: number = parseType(rule.value, "number")
  return (
    value == null ||
    (value?.key
      ? value.size / 1000000 <= limit
      : value.reduce(
          (acc: number, currentItem: { size: number }) =>
            acc + currentItem.size,
          0
        ) /
          1000000 <=
        limit)
  )
}

// Evaluates a min value constraint
const minValueHandler = (value: any, rule: UIFieldValidationRule) => {
  // Use same type as the value so that things can be compared
  const limit = parseType(rule.value, rule.type)
  return value == null || value >= limit
}

// Evaluates a max value constraint
const maxValueHandler = (value: any, rule: UIFieldValidationRule) => {
  // Use same type as the value so that things can be compared
  const limit = parseType(rule.value, rule.type)
  return value == null || value <= limit
}

// Evaluates an inclusion constraint
const inclusionHandler = (value: any, rule: UIFieldValidationRule) => {
  return value == null || (rule.value as any).includes(value)
}

// Evaluates an equal constraint
const equalHandler = (value: any, rule: UIFieldValidationRule) => {
  const ruleValue = parseType(rule.value, rule.type)
  return value === ruleValue
}

// Evaluates a not equal constraint
const notEqualHandler = (value: any, rule: UIFieldValidationRule) => {
  const ruleValue = parseType(rule.value, rule.type)
  if (value == null && ruleValue == null) {
    return true
  }
  return value !== ruleValue
}

// Evaluates a regex constraint
const regexHandler = (value: any, rule: UIFieldValidationRule) => {
  const regex = parseType(rule.value, "string")
  if (!value) {
    value = ""
  }
  return new RegExp(regex).test(value)
}

// Evaluates a not regex constraint
const notRegexHandler = (value: any, rule: UIFieldValidationRule) => {
  return !regexHandler(value, rule)
}

// Evaluates a contains constraint
const containsHandler = (value: any, rule: UIFieldValidationRule) => {
  const expectedValue = parseType(rule.value, "string")
  return value && value.includes(expectedValue)
}

// Evaluates a not contains constraint
const notContainsHandler = (value: any, rule: UIFieldValidationRule) => {
  return !containsHandler(value, rule)
}

// Evaluates a constraint that the value must be a valid json object
const jsonHandler = (value: any) => {
  if (typeof value !== "object" || Array.isArray(value)) {
    return false
  }
  try {
    JSON.parse(JSON.stringify(value))
    return true
  } catch (error) {
    return false
  }
}

/**
 * Map of constraint types to handlers.
 */
const handlerMap = {
  required: requiredHandler,
  minLength: minLengthHandler,
  maxLength: maxLengthHandler,
  minValue: minValueHandler,
  maxValue: maxValueHandler,
  inclusion: inclusionHandler,
  equal: equalHandler,
  notEqual: notEqualHandler,
  regex: regexHandler,
  notRegex: notRegexHandler,
  contains: containsHandler,
  notContains: notContainsHandler,
  json: jsonHandler,
  maxFileSize: maxFileSizeHandler,
  maxUploadSize: maxUploadSizeHandler,
}

/**
 * Helper to check for null, undefined or empty string values
 * @param value the value to test
 * @returns {boolean} whether the value exists or not
 */
const exists = <T = any>(value: T | null | undefined): value is T => {
  return value != null && value !== ""
}
