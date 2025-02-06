import { Document } from "../document"
import { BasicOperator } from "../../sdk"

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
  operator: BasicOperator
  action: "update" | "show" | "hide"
  valueType: "string" | "number" | "datetime" | "boolean"
  newValue?: any
  referenceValue?: any
  setting?: string
  settingValue?: any
}
