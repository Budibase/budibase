import { Document } from "../.."

export interface KnowledgeBase extends Document {
  name: string
  embeddingModel: string
  vectorDb: string
}
