import { Document } from "../document"

export interface Screen extends Document {
  layoutId?: string
  showNavigation?: boolean
  width?: string
  routing: {
    route: string
    roleId: string
    homeScreen?: boolean
  }
}
