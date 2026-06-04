import { Document } from "../document"

export interface Project extends Document {
  name: string
  description?: string
  color?: string
}
