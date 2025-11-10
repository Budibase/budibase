import { Document } from "../../"

export interface CustomAIProviderConfig extends Document {
  name: string
  provider: string
  isDefault: boolean
  baseUrl: string
  model: string
  apiKey?: string
  liteLLMModelId: string
}
