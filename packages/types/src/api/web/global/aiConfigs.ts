import { CustomAIProviderConfig } from "../../../documents"

export type AIConfigListResponse = CustomAIProviderConfig[]
export type CreateAIConfigRequest = Omit<
  CustomAIProviderConfig,
  "_id" | "_rev" | "_deleted"
>
export type UpdateAIConfigRequest = CustomAIProviderConfig
