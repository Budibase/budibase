import type { Document } from "../../"

export interface RagConfig extends Document {
  name: string
  embeddingModel: string
  vectorDb: string
  ragMinDistance: number
  ragTopK: number
}
