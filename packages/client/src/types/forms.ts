import { Readable } from "svelte/store"
import { FieldSchema, FieldType } from "@budibase/types"

export interface FormContext {
  formApi?: {
    registerField: (
      field: string,
      type: FieldType,
      defaultValue: string | undefined,
      disabled: boolean,
      readonly: boolean,
      validation: FieldValidation | undefined,
      formStep: number
    ) => Readable<FormField>
  }
}

export type FieldValidation = () => string | undefined

export interface FormField {
  fieldState: FieldState
  fieldApi: FieldApi
  fieldSchema: FieldSchema
}

export interface FieldApi {
  setValue(value: any): boolean
  deregister(): void
}

export interface FieldState<T = any> {
  value: T
  fieldId: string
  disabled: boolean
  readonly: boolean
  error?: string
}
