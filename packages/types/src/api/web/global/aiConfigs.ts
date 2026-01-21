import { CustomAIProviderConfig } from "../../../documents"

export type AIConfigListResponse = CustomAIProviderConfig[]
export type CreateAIConfigRequest = Omit<
  CustomAIProviderConfig,
  "_id" | "_rev" | "_deleted"
>
export type UpdateAIConfigRequest = CustomAIProviderConfig

export interface AIProviderField {
  key: string
  label: string
  placeholder?: string | null
  tooltip?: string | null
  required?: boolean
  field_type?: string
  options?: string[] | null
  default_value?: string | null
}

export interface AIProvider {
  id: string
  displayName: string
  externalProvider: string
  default_model_placeholder?: string | null
  credentialFields: AIProviderField[]
}

export type AIProvidersResponse = AIProvider[]
