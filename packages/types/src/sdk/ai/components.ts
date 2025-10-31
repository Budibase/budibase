export type ComponentPayload = ButtonPayload | FormPayload

export interface ButtonPayload {
  type: "Button"
  componentId: string
  props: {
    text: string
    primary: boolean
    onClick: string
  }
}

export interface FormPayload {
  type: "Form"
  componentId: string
  props: {
    title: string
    submitButtonText: string
    message?: string
    tableId: string
    fields: FormFieldPayload[]
  }
}

export enum FormFieldType {
  Input = "Input",
  InputNumber = "InputNumber",
  TextArea = "TextArea",
  Select = "Select",
  Checkbox = "Checkbox",
  Toggle = "Toggle",
  Date = "Date",
}

interface BaseFormFieldPayload<T extends FormFieldType> {
  name: string
  type: T
  helpText?: string
  errorText: string
}

interface SelectFormFieldPayload
  extends BaseFormFieldPayload<FormFieldType.Select> {
  options: string[]
}

export type FormFieldPayload =
  | BaseFormFieldPayload<Exclude<FormFieldType, FormFieldType.Select>>
  | SelectFormFieldPayload
