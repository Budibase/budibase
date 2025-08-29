import { Document } from "../document"
import { ArrayOperator, BasicOperator } from "../../sdk"
import { FieldType } from "./row"

export interface Component extends Document {
  _instanceName: string
  _styles: { [key: string]: any }
  _component: string
  _children?: Component[]
  _conditions?: ComponentCondition[]
  [key: string]: any
}

export interface ComponentCondition {
  id: string
  operator: ArrayOperator | BasicOperator
  action: "update" | "show" | "hide"
  type: FieldType
  valueType: "string" | "number" | "datetime" | "boolean"
  newValue?: unknown
  referenceValue?: unknown
  setting?: string
  settingValue?: unknown
  noValue?: boolean
}
