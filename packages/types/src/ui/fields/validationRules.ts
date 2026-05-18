import { FieldType } from "../../documents"

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
  | "contains"
  | "notContains"
  | "json"
  | "maxFileSize"
  | "maxUploadSize"

const hasValidationValue = (value: unknown): boolean => {
  return value != null && value !== ""
}

export const defaultErrorForConstraint = (
  constraint: string | undefined,
  value: unknown
): string => {
  switch (constraint) {
    case "required":
      return "Required"
    case "minLength":
      return hasValidationValue(value)
        ? `Must be at least ${value} characters`
        : "Too short"
    case "maxLength":
      return hasValidationValue(value)
        ? `Must be at most ${value} characters`
        : "Too long"
    case "minValue":
      return hasValidationValue(value)
        ? `Must be at least ${value}`
        : "Value too low"
    case "maxValue":
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
