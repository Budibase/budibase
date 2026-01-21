import { CustomAIProviderConfig } from "../../../documents"

export type AIConfigListResponse = CustomAIProviderConfig[]
export type CreateAIConfigRequest = Omit<
  CustomAIProviderConfig,
  "_id" | "_rev" | "_deleted"
>
export type UpdateAIConfigRequest = CustomAIProviderConfig

export interface LLMProviderField {
  key: string
  label: string
  placeholder?: string | null
  tooltip?: string | null
  required?: boolean
  field_type?: string
  options?: string[] | null
  default_value?: string | null
}

export interface LLMProvider {
  id: string
  displayName: string
  externalProvider: string
  defaultModelPlaceholder?: string
  credentialFields: LLMProviderField[]
}

export type LLMProvidersResponse = LLMProvider[]
