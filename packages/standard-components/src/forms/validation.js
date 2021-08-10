import flatpickr from "flatpickr"

/**
 * Creates a validation function from a combination of schema-level constraints
 * and custom validation rules
 * @param schemaConstraints any schema level constraints from the table
 * @param customRules any custom validation rules
 * @param field the field name we are evaluating
 * @param table the definition of the table we are evaluating
 * @returns {function} a validator function which accepts test values
 */
export const createValidatorFromConstraints = (
  schemaConstraints,
  customRules,
  field,
  table
) => {
  let rules = []

  // Convert schema constraints into validation rules
  if (schemaConstraints) {
    // Required constraint
    if (
      field === table?.primaryDisplay ||
      schemaConstraints.presence?.allowEmpty === false
    ) {
      rules.push({
        type: "string",
        constraint: "required",
        error: "Required",
      })
    }

    // String length constraint
    if (exists(schemaConstraints.length?.maximum)) {
      const length = schemaConstraints.length.maximum
      rules.push({
        type: "string",
        constraint: "length",
        value: length,
        error: val => `Maximum length is ${val}`,
      })
    }

    // Min / max number constraint
    if (exists(schemaConstraints.numericality?.greaterThanOrEqualTo)) {
      const min = schemaConstraints.numericality.greaterThanOrEqualTo
      rules.push({
        type: "number",
        constraint: "minValue",
        value: min,
        error: val => `Minimum value is ${val}`,
      })
    }
    if (exists(schemaConstraints.numericality?.lessThanOrEqualTo)) {
      const max = schemaConstraints.numericality.lessThanOrEqualTo
      rules.push({
        type: "number",
        constraint: "maxValue",
        value: max,
        error: val => `Maximum value is ${val}`,
      })
    }

    // Inclusion constraint
    if (exists(schemaConstraints.inclusion)) {
      const options = schemaConstraints.inclusion
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
      rules.push({
        type: "datetime",
        constraint: "minValue",
        value: limit,
        error: val => {
          const date = flatpickr.formatDate(new Date(val), "F j Y, H:i")
          return `Earliest date is ${date}`
        },
      })
    }
    if (exists(schemaConstraints.datetime?.latest)) {
      const limit = schemaConstraints.datetime.latest
      rules.push({
        type: "datetime",
        constraint: "maxValue",
        value: limit,
        error: val => {
          const date = flatpickr.formatDate(new Date(val), "F j Y, H:i")
          return `Latest date is ${date}`
        },
      })
    }
  }

  // Add custom validation rules
  rules = rules.concat(customRules || [])

  // Evaluate each constraint
  return value => {
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
const evaluateRule = (rule, value) => {
  if (!rule) {
    return null
  }

  // Determine the correct handler for this rule
  const handler = handlerMap[rule.constraint]
  if (!handler) {
    return null
  }

  // Coerce values into correct types
  const parsedValue = parseType(value, rule.type)
  const parsedRuleValue = parseType(rule.value, rule.type)

  // Evaluate the rule
  const pass = handler(parsedValue, parsedRuleValue)
  if (pass) {
    return null
  }

  // Return an error if the validation failed
  let error = rule.error
  if (typeof error === "function") {
    error = rule.error(parsedRuleValue)
  }
  return error || "Error"
}

/**
 * Parses a value to the specified type so that values are always compared
 * in the same format.
 * @param value the value to parse
 * @param type the type to parse
 * @returns {boolean|string|*|number|null} the parsed value, or null if invalid
 */
const parseType = (value, type) => {
  // Treat nulls or empty strings as null
  if (!exists(value) || !type) {
    return null
  }

  // Parse as string
  if (type === "string") {
    if (typeof value === "string" || Array.isArray(value)) {
      return value
    }
    if (value.length === 0) {
      return null
    }
    return `${value}`
  }

  // Parse as number
  if (type === "number") {
    if (isNaN(value)) {
      return null
    }
    return parseFloat(value)
  }

  // Parse as date
  if (type === "datetime") {
    if (value instanceof Date) {
      return value.getTime()
    }
    const time = isNaN(value) ? Date.parse(value) : new Date(value).getTime()
    return isNaN(time) ? null : time
  }

  // Parse as boolean
  if (type === "boolean") {
    if (typeof value === "string") {
      return value.toLowerCase() === "true"
    }
    return value === true
  }

  // Parse attachments, treating no elements as null
  if (type === "attachment") {
    if (!Array.isArray(value) || !value.length) {
      return null
    }
    return value
  }

  // Parse links, treating no elements as null
  if (type === "link") {
    if (!Array.isArray(value) || !value.length) {
      return null
    }
    return value
  }

  // If some unknown type, treat as null to avoid breaking validators
  return null
}

// Evaluates a required constraint
const requiredHandler = value => {
  return value != null
}

// Evaluates a max length constraint
const maxLengthHandler = (value, maxLength) => {
  if (value == null) {
    return true
  }
  return value.length <= maxLength
}

// Evaluates a min value constraint
const minValueHandler = (value, minValue) => {
  if (value == null) {
    return true
  }
  return value >= minValue
}

// Evaluates a max value constraint
const maxValueHandler = (value, maxValue) => {
  if (value == null) {
    return true
  }
  return value <= maxValue
}

// Evaluates an inclusion constraint
const inclusionHandler = (value, options) => {
  return options.includes(value)
}

// Evaluates an equal constraint
const equalHandler = (value, referenceValue) => {
  return value === referenceValue
}

// Evaluates a not equal constraint
const notEqualHandler = (value, referenceValue) => {
  return !equalHandler(value, referenceValue)
}

// Evaluates a regex constraint
const regexHandler = (value, regex) => {
  return new RegExp(regex).test(value)
}

// Evaluates a not regex constraint
const notRegexHandler = (value, regex) => {
  return !regexHandler(value, regex)
}

/**
 * Map of constraint types to handlers.
 */
const handlerMap = {
  required: requiredHandler,
  maxLength: maxLengthHandler,
  minValue: minValueHandler,
  maxValue: maxValueHandler,
  inclusion: inclusionHandler,
  equal: equalHandler,
  notEqual: notEqualHandler,
  regex: regexHandler,
  notRegex: notRegexHandler,
}

/**
 * Helper to check for null, undefined or empty string values
 * @param value the value to test
 * @returns {boolean} whether the value exists or not
 */
const exists = value => {
  return value != null && value !== ""
}
