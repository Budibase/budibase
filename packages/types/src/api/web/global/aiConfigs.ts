import { CustomAIProviderConfig } from "../../../documents"
import { WithoutDocMetadata } from "../../../shared"

export interface AIConfigResponse
  extends Pick<
    CustomAIProviderConfig,
    | "_id"
    | "_rev"
    | "name"
    | "provider"
    | "model"
    | "webSearchConfig"
    | "configType"
    | "reasoningEffort"
    | "credentialsFields"
  > {}

export type AIConfigListResponse = AIConfigResponse[]
export type CreateAIConfigRequest = WithoutDocMetadata<AIConfigResponse>
export type UpdateAIConfigRequest = AIConfigResponse

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
  credentialFields: LLMProviderField[]
}

export type LLMProvidersResponse = LLMProvider[]
