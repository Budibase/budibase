import { Document } from "../document"

export interface ProjectApp extends Document {
  name: string
  urlPrefix: string
  icon: string
}
