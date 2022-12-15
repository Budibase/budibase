import { Document } from "../document"

export interface Component extends Document {
  _instanceName: string
  _styles: { [key: string]: any }
  _component: string
  _children?: Component[]
  [key: string]: any
}
