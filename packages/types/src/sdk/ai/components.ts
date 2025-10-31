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
}

interface BaseFormFieldPayload<T extends FormFieldType> {
  name: string
  type: T
  helpText?: string
  errorText: string
}

interface InputFormFieldPayload
  extends BaseFormFieldPayload<FormFieldType.Input> {}
interface InputNumberFormFieldPayload
  extends BaseFormFieldPayload<FormFieldType.InputNumber> {}
interface TextAreaFormFieldPayload
  extends BaseFormFieldPayload<FormFieldType.TextArea> {}
interface SelectFormFieldPayload
  extends BaseFormFieldPayload<FormFieldType.Select> {
  options: string[]
}
interface CheckboxFormFieldPayload
  extends BaseFormFieldPayload<FormFieldType.Checkbox> {}
interface ToggleFormFieldPayload
  extends BaseFormFieldPayload<FormFieldType.Toggle> {}

export type FormFieldPayload =
  | InputFormFieldPayload
  | InputNumberFormFieldPayload
  | TextAreaFormFieldPayload
  | SelectFormFieldPayload
  | CheckboxFormFieldPayload
  | ToggleFormFieldPayload
