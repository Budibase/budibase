import { FieldType } from "../../documents"

export interface UIFieldValidationRule {
  type: `${FieldType}`
  constraint: FieldValidationRuleType
  value?: string | number | string[]
  error: string
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
