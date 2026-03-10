import { KnowledgeBase } from "../../../documents"

export type KnowledgeBaseListResponse = KnowledgeBase[]
export type CreateKnowledgeBaseRequest = Omit<
  KnowledgeBase,
  "_id" | "_rev" | "_deleted"
>
export type UpdateKnowledgeBaseRequest = KnowledgeBase
