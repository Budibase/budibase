import { Document } from "../document"

export interface Template extends Document {
  ownerId?: string
  name?: string
  contents: string
  purpose: string
  type?: string
}
