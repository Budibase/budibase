import { Document } from "../.."

export enum VectorDbProvider {
  PGVECTOR = "pgvector",
}

export interface VectorDb extends Document {
  name: string
  provider: VectorDbProvider
  host: string
  port: string | number
  database: string
  user?: string
  password?: string
}
