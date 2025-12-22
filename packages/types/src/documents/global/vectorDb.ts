import { Document } from "../.."

export interface VectorDb extends Document {
  name: string
  provider: string
  host: string
  port: string
  database: string
  user?: string
  password?: string
  isDefault: boolean
}
