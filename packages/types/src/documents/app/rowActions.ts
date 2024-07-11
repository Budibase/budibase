import { Document } from "../document"

export interface TableRowActions extends Document {
  _id: string
  actions: {
    id: string
    name: string
  }[]
}
