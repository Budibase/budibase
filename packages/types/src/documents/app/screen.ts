import { Document } from "../document"

export interface Screen extends Document {
  layoutId: string
  routing: {
    route: string
    roleId: string
  }
}
