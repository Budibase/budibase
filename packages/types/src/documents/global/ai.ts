import { Document, WebSearchConfig } from "../../"

export enum AIConfigType {
  COMPLETIONS = "completions",
  EMBEDDINGS = "embeddings",
}

export interface CustomAIProviderConfig extends Document {
  name: string
  provider: string
  credentialsFields: Record<string, string>

  model: string
  liteLLMModelId: string
  webSearchConfig?: WebSearchConfig
  configType: AIConfigType
}

export interface LiteLLMKeyConfig extends Document {
  keyId: string
  secretKey: string
}
