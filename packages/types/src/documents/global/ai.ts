import { Document } from "../../"

export interface CustomAIProviderConfig extends Document {
  name: string
  isDefault: boolean
  baseUrl: string
  model: string
  apiKey?: string
  liteLLMKey: string
}
