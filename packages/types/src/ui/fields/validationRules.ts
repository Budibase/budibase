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
