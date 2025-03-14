import {
  FieldType,
  FieldConstraints,
  type FieldSchema,
  type FormulaResponseType,
} from "../"

export interface UIField {
  name: string
  type: FieldType
  subtype?: string
  icon: string
  constraints?: {
    type?: string
    presence?: boolean
    length?: any
    inclusion?: string[]
    numericality?: {
      greaterThanOrEqualTo?: string
      lessThanOrEqualTo?: string
    }
    datetime?: {
      latest?: string
      earliest?: string
    }
  }
}

// an empty/partial field schema which is used when building new columns in the UI
// the current construction process of a column means that it is never certain what
// this object contains, or what type it is currently set to, meaning that our
// strict FieldSchema isn't really usable here, the strict fieldSchema only occurs
// when the table is saved, but in the UI in can be in a real mix of states
export type FieldSchemaConfig = FieldSchema & {
  constraints: FieldConstraints
  fieldName?: string
  responseType?: FormulaResponseType
  default?: any
  fieldId?: string
  optionColors?: string[]
  schema?: any
  json?: string
}
