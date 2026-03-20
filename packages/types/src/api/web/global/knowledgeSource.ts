import { KnowledgeSource } from "../../../documents"

export type KnowledgeSourceListResponse = KnowledgeSource[]
export type CreateKnowledgeSourceRequest = Omit<
  KnowledgeSource,
  "_id" | "_rev" | "_deleted"
>
export type UpdateKnowledgeSourceRequest = KnowledgeSource
