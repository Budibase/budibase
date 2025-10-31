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
    message?: string
    fields: FormFieldPayload[]
  }
}

export enum FormFieldType {
  Input = "Input",
  TextArea = "TextArea",
  Select = "Select",
  Checkbox = "Checkbox",
  Toggle = "Toggle",
}

export interface FormFieldPayload {
  name: string
  type: FormFieldType
  helpText?: string
  errorText: string
}
