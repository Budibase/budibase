import { Document } from "../.."

export interface VectorDb extends Document {
  name: string
  provider: string
  host: string
  port: number
  database: string
  user?: string
  password?: string
}
