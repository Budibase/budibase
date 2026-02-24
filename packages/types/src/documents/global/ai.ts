import { Document, WebSearchConfig } from "../../"

export enum AIConfigType {
  COMPLETIONS = "completions",
  EMBEDDINGS = "embeddings",
}

export type ReasoningEffort = "low" | "medium" | "high"

export const BUDIBASE_AI_PROVIDER_ID = "Budibase"

export interface CustomAIProviderConfig extends Document {
  name: string
  provider: string
  credentialsFields: Record<string, string>
  model: string
  liteLLMModelId: string
  webSearchConfig?: WebSearchConfig
  configType: AIConfigType
  reasoningEffort?: ReasoningEffort
}

export interface LiteLLMKeyConfig extends Document {
  keyId: string
  secretKey: string
}
