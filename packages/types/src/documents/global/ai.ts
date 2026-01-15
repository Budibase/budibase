import { Document, WebSearchConfig } from "../../"

export enum AIConfigType {
  COMPLETIONS = "completions",
  EMBEDDINGS = "embeddings",
}

export interface CustomAIProviderConfig extends Document {
  name: string
  provider: string
  isDefault: boolean
  baseUrl: string
  model: string
  apiKey?: string
  liteLLMModelId: string
  webSearchConfig?: WebSearchConfig
  configType: AIConfigType
}
