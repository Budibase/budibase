import type { Document } from "../document"

export interface DevInfo extends Document {
  userId: string
  apiKey?: string
}
