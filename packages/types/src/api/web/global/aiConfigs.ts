import { CustomAIProviderConfig } from "../../../documents"

export type AIConfigListResponse = CustomAIProviderConfig[]
export type CreateAIConfigRequest = Omit<
  CustomAIProviderConfig,
  "_id" | "_rev" | "_deleted"
>
export type UpdateAIConfigRequest = CustomAIProviderConfig

export interface AIProviderField {
  id: string
  displayName: string
  externalProvider: string
}
export type AIProvidersResponse = AIProviderField[]
