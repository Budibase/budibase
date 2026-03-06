import { Document } from "../document"

export interface Playbook extends Document {
  name: string
  description?: string
  color?: string
}
