import { Document } from "../document"

export interface Layout extends Document {
  componentLibraries: string[]
  title: string
  favicon: string
  stylesheets: string[]
  props: any
  layoutId?: string
  name?: string
}
