import dayjs from "dayjs"
import { Helpers } from "@budibase/bbui"
import {
  defaultErrorForConstraint,
  DEFAULT_URL_VALIDATION_PROTOCOLS,
  FieldConstraints,
  FieldType,
  Table,
  UIFieldValidationRule,
  URL_VALIDATION_PROTOCOLS,
  type UrlValidationProtocol,
} from "@budibase/types"

/**
 * Creates a validation function from a combination of schema-level constraints
 * and custom validation rules
 */
export const createValidatorFromConstraints = (
  schemaConstraints: FieldConstraints | null | undefined,
  customRules: UIFieldValidationRule[],
  field: string,
  definition: Table | undefined,
  requiredError?: string
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
        type:
          schemaConstraints.type == FieldType.ARRAY
            ? FieldType.ARRAY
            : FieldType.STRING,
        constraint: "required",
        error: requiredError || "Required",
      })
    }

    // String length constraint
    if (exists(schemaConstraints.length?.maximum)) {
      const length = schemaConstraints.length.maximum
      rules.push({
        type: FieldType.STRING,
        constraint: "maxLength",
        value: length,
        error: `Maximum length is ${length}`,
      })
    }

    // Min / max number constraint
    if (exists(schemaConstraints.numericality?.greaterThanOrEqualTo)) {
      const min = schemaConstraints.numericality.greaterThanOrEqualTo
      rules.push({
        type: FieldType.NUMBER,
        constraint: "minValue",
        value: min,
        error: `Minimum value is ${min}`,
      })
    }
    if (exists(schemaConstraints.numericality?.lessThanOrEqualTo)) {
      const max = schemaConstraints.numericality.lessThanOrEqualTo
      rules.push({
        type: FieldType.NUMBER,
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
        type: FieldType.STRING,
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
        type: FieldType.DATETIME,
        constraint: "minValue",
        value: limit,
        error: `Earliest date is ${limitString}`,
      })
    }
    if (exists(schemaConstraints.datetime?.latest)) {
      const limit = schemaConstraints.datetime.latest
      const limitString = Helpers.getDateDisplayValue(dayjs(limit))
      rules.push({
        type: FieldType.DATETIME,
        constraint: "maxValue",
        value: limit,
        error: `Latest date is ${limitString}`,
      })
    }
  }

  // Add custom validation rules
  rules = rules.concat(customRules || [])

  // Evaluate each constraint
  return (value: unknown) => {
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
const evaluateRule = (rule: UIFieldValidationRule, value: unknown) => {
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
  return pass
    ? null
    : rule.error ||
        defaultErrorForConstraint(rule.constraint, rule.value, rule.type)
}

/**
 * Parses a value to the specified type so that values are always compared
 * in the same format.
 * @param value the value to parse
 * @param type the type to parse
 * @returns {boolean|string|*|number|null|array} the parsed value, or null if invalid
 */
const parseType = (value: unknown, type: `${FieldType}`) => {
  // Treat nulls or empty strings as null
  if (!exists(value) || !type) {
    return null
  }

  // Parse as string
  if (type === FieldType.STRING) {
    if (typeof value === "string" || Array.isArray(value)) {
      return value
    }
    if ((value as { length: number }).length === 0) {
      return null
    }
    return `${value}`
  }

  // Parse as number
  if (type === FieldType.NUMBER) {
    if (isNaN(value as number)) {
      return null
    }
    return parseFloat(value as string)
  }

  // Parse as date
  if (type === FieldType.DATETIME) {
    if (value instanceof Date) {
      return value.getTime()
    }
    const time = isNaN(value as number)
      ? Date.parse(value as string)
      : new Date(value as string | number | Date).getTime()
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
    if (!(value as { key?: unknown } | null | undefined)?.key) {
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
const requiredHandler = (value: unknown) => {
  return value != null
}

// Evaluates a min length constraint
const minLengthHandler = (value: unknown, rule: UIFieldValidationRule) => {
  const limit = parseType(rule.value, "number") as number
  return value == null || (value as { length: number }).length >= limit
}

// Evaluates a max length constraint
const maxLengthHandler = (value: unknown, rule: UIFieldValidationRule) => {
  const limit = parseType(rule.value, "number") as number
  return value == null || (value as { length: number }).length <= limit
}

// Evaluates a max file size (MB) constraint
const maxFileSizeHandler = (value: unknown, rule: UIFieldValidationRule) => {
  const limit = parseType(rule.value, "number") as number
  const check = (attachment: { size: number }) =>
    attachment.size / 1000000 > limit
  const attachments = value as {
    key?: unknown
    size: number
    some: (predicate: (attachment: { size: number }) => boolean) => boolean
  }
  return (
    value == null ||
    !(attachments?.key ? check(attachments) : attachments.some(check))
  )
}

// Evaluates a max total upload size (MB) constraint
const maxUploadSizeHandler = (value: unknown, rule: UIFieldValidationRule) => {
  const limit = parseType(rule.value, "number") as number
  const attachments = value as {
    key?: unknown
    size: number
    reduce: (
      callback: (acc: number, currentItem: { size: number }) => number,
      initialValue: number
    ) => number
  }
  return (
    value == null ||
    (attachments?.key
      ? attachments.size / 1000000 <= limit
      : attachments.reduce(
          (acc: number, currentItem: { size: number }) =>
            acc + currentItem.size,
          0
        ) /
          1000000 <=
        limit)
  )
}

// Evaluates a min value constraint
const minValueHandler = (value: unknown, rule: UIFieldValidationRule) => {
  // Use same type as the value so that things can be compared
  const limit = parseType(rule.value, rule.type) as number
  return value == null || (value as number) >= limit
}

// Evaluates a max value constraint
const maxValueHandler = (value: unknown, rule: UIFieldValidationRule) => {
  // Use same type as the value so that things can be compared
  const limit = parseType(rule.value, rule.type) as number
  return value == null || (value as number) <= limit
}

// Evaluates an inclusion constraint
const inclusionHandler = (value: unknown, rule: UIFieldValidationRule) => {
  if (value == null) {
    return true
  }
  if (typeof rule.value === "string") {
    return rule.value.includes(String(value))
  }
  if (Array.isArray(rule.value)) {
    return rule.value.includes(String(value))
  }
  return true
}

// Evaluates an equal constraint
const equalHandler = (value: unknown, rule: UIFieldValidationRule) => {
  const ruleValue = parseType(rule.value, rule.type)
  return value === ruleValue
}

// Evaluates a not equal constraint
const notEqualHandler = (value: unknown, rule: UIFieldValidationRule) => {
  const ruleValue = parseType(rule.value, rule.type)
  if (value == null && ruleValue == null) {
    return true
  }
  return value !== ruleValue
}

// Evaluates a regex constraint
const regexHandler = (value: unknown, rule: UIFieldValidationRule) => {
  const regex = parseType(rule.value, "string")
  const testValue = value ? String(value) : ""
  return typeof regex === "string" && new RegExp(regex).test(testValue)
}

// Evaluates a not regex constraint
const notRegexHandler = (value: unknown, rule: UIFieldValidationRule) => {
  return !regexHandler(value, rule)
}

const isUrlValidationProtocol = (
  protocol: unknown
): protocol is UrlValidationProtocol => {
  const protocols: readonly string[] = URL_VALIDATION_PROTOCOLS
  return typeof protocol === "string" && protocols.includes(protocol)
}

const getAllowedUrlProtocols = (
  rule: UIFieldValidationRule
): UrlValidationProtocol[] => {
  if (!Array.isArray(rule.value) || !rule.value.length) {
    return DEFAULT_URL_VALIDATION_PROTOCOLS
  }

  return rule.value.filter(isUrlValidationProtocol)
}

const hasExplicitUrlProtocol = (value: string): boolean => {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(value) || /^mailto:/i.test(value)
}

const isValidIpv4Hostname = (hostname: string): boolean => {
  const parts = hostname.split(".")
  return (
    parts.length === 4 &&
    parts.every(part => {
      if (!/^\d{1,3}$/.test(part)) {
        return false
      }
      const value = Number(part)
      return value >= 0 && value <= 255 && String(value) === part
    })
  )
}

const isValidDomainHostname = (hostname: string): boolean => {
  const labels = hostname.split(".")
  const topLevelDomain = labels[labels.length - 1]

  if (labels.length < 2) {
    return false
  }

  if (!/^([a-z]{2,}|xn--[a-z0-9-]{2,})$/i.test(topLevelDomain)) {
    return false
  }

  return labels.every(label => {
    return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label)
  })
}

const isValidUrlHostname = (hostname: string): boolean => {
  const normalisedHostname = hostname.replace(/^\[|\]$/g, "")

  if (!normalisedHostname) {
    return false
  }
  if (normalisedHostname === "localhost") {
    return true
  }
  if (normalisedHostname.includes(":")) {
    return true
  }
  if (isValidIpv4Hostname(normalisedHostname)) {
    return true
  }
  return isValidDomainHostname(normalisedHostname)
}

const isValidEmailAddress = (value: string): boolean => {
  const parts = value.split("@")
  if (parts.length !== 2) {
    return false
  }

  const [localPart, domain] = parts
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(localPart)) {
    return false
  }
  return isValidDomainHostname(domain)
}

const isValidMailtoUrl = (url: URL): boolean => {
  return !url.host && !url.hash && isValidEmailAddress(url.pathname)
}

const urlHandler = (value: unknown, rule: UIFieldValidationRule) => {
  if (value == null) {
    return true
  }
  if (typeof value !== "string") {
    return false
  }

  const allowedProtocols = getAllowedUrlProtocols(rule)
  const trimmedValue = value.trim()
  if (trimmedValue.includes("\\")) {
    return false
  }
  const valueToParse = hasExplicitUrlProtocol(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`

  try {
    const url = new URL(valueToParse)
    const protocol = url.protocol.replace(":", "")

    if (!isUrlValidationProtocol(protocol)) {
      return false
    }
    if (!allowedProtocols.includes(protocol)) {
      return false
    }
    if (protocol === "mailto") {
      return isValidMailtoUrl(url)
    }
    if (url.username || url.password) {
      return false
    }
    return isValidUrlHostname(url.hostname)
  } catch {
    return false
  }
}

const emailHandler = (value: unknown) => {
  if (value == null) {
    return true
  }
  if (typeof value !== "string") {
    return false
  }
  return isValidEmailAddress(value)
}

// Evaluates a contains constraint
const containsHandler = (value: unknown, rule: UIFieldValidationRule) => {
  const expectedValue = parseType(rule.value, "string")
  if (typeof expectedValue !== "string") {
    return false
  }
  if (value == null) {
    return false
  }
  if (typeof value === "string") {
    return value.includes(expectedValue)
  }
  if (Array.isArray(value)) {
    return value.includes(expectedValue)
  }
  return false
}

// Evaluates a not contains constraint
const notContainsHandler = (value: unknown, rule: UIFieldValidationRule) => {
  return !containsHandler(value, rule)
}

// Evaluates a constraint that the value must be a valid json object
const jsonHandler = (value: unknown) => {
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
  url: urlHandler,
  email: emailHandler,
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
const exists = <T = unknown>(value: T | null | undefined): value is T => {
  return value != null && value !== ""
}
