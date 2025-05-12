import { Document } from "../document"

export interface Layout extends Document {
  componentLibraries?: string[]
  title?: string
  favicon?: string
  stylesheets?: string[]
  props: any
  layoutId?: string
  name?: string
  navigation?: string
  pageWidth?: string
  embedded?: boolean
  logoUrl?: string
  hideTitle?: boolean
}
