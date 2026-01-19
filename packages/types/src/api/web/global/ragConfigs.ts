import { RagConfig } from "../../../documents"

export type RagConfigListResponse = RagConfig[]
export type CreateRagConfigRequest = Omit<
  RagConfig,
  "_id" | "_rev" | "_deleted"
>
export type UpdateRagConfigRequest = RagConfig
