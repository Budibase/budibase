import { Document } from "../../"

export interface CustomAIProviderConfig extends Document {
  provider: "Custom"
  name: string
  active: boolean
  isDefault: boolean
  apiKey?: string
  baseUrl?: string
  defaultModel?: string
}
