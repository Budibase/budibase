import { FieldType } from "../../documents"

export const URL_VALIDATION_PROTOCOLS = [
  "http",
  "https",
  "ftp",
  "mailto",
] as const

export type UrlValidationProtocol = (typeof URL_VALIDATION_PROTOCOLS)[number]

export const DEFAULT_URL_VALIDATION_PROTOCOLS: UrlValidationProtocol[] = [
  "http",
  "https",
]

export interface UIFieldValidationRule {
  id?: string
  type: FieldType
  constraint: FieldValidationRuleType
  value?: string | number | string[]
  valueType?: "Binding" | "Value"
  error?: string
}

export type FieldValidationRuleType =
  | "required"
  | "minLength"
  | "maxLength"
  | "minValue"
  | "maxValue"
  | "inclusion"
  | "equal"
  | "notEqual"
  | "regex"
  | "notRegex"
  | "url"
  | "contains"
  | "notContains"
  | "json"
  | "maxFileSize"
  | "maxUploadSize"

const hasValidationValue = (value: unknown): boolean => {
  return value != null && value !== "" && !isJSBindingValue(value)
}

const isJSBindingValue = (value: unknown): boolean => {
  return typeof value === "string" && value.trim().startsWith("{{ js ")
}

export const defaultErrorForConstraint = (
  constraint: string | undefined,
  value: unknown,
  type?: string | FieldType
): string => {
  switch (constraint) {
    case "required":
      return "Required"
    case "url":
      return "Must be a valid URL"
    case "minLength":
      return hasValidationValue(value)
        ? `Must be at least ${value} characters`
        : "Too short"
    case "maxLength":
      return hasValidationValue(value)
        ? `Must be at most ${value} characters`
        : "Too long"
    case "minValue":
      if (type === FieldType.DATETIME) {
        return hasValidationValue(value)
          ? `Must be no earlier than ${value}`
          : "Value too low"
      }
      return hasValidationValue(value)
        ? `Must be at least ${value}`
        : "Value too low"
    case "maxValue":
      if (type === FieldType.DATETIME) {
        return hasValidationValue(value)
          ? `Must be no later than ${value}`
          : "Value too high"
      }
      return hasValidationValue(value)
        ? `Must be at most ${value}`
        : "Value too high"
    case "equal":
      return hasValidationValue(value) ? `Must equal ${value}` : "Invalid value"
    case "notEqual":
      return hasValidationValue(value)
        ? `Must not equal ${value}`
        : "Invalid value"
    case "regex":
    case "notRegex":
      return "Invalid format"
    case "contains":
      return hasValidationValue(value)
        ? `Must contain "${value}"`
        : "Missing required content"
    case "notContains":
      return hasValidationValue(value)
        ? `Must not contain "${value}"`
        : "Invalid content"
    case "maxFileSize":
      return hasValidationValue(value)
        ? `Files must be smaller than ${value} MB`
        : "File too large"
    case "maxUploadSize":
      return hasValidationValue(value)
        ? `Total upload size must be at most ${value} MB`
        : "Upload too large"
    default:
      return "Invalid value"
  }
}
