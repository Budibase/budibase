import { Document } from "../document"

export interface TableRowActions extends Document {
  _id: string
  actions: {
    name: string
  }[]
}
