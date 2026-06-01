export type ValidationValue = string | number | string[] | null

export interface ValidationEditorRule {
  id: string
  type?: string
  constraint?: string
  value?: ValidationValue
  valueType?: "Binding" | "Value"
  error?: string
}

export interface SchemaValidationRule {
  constraint?: string
  value?: ValidationValue
  error?: string
}
