import { VectorStore } from "../../../documents"

export type VectorStoreListResponse = VectorStore[]
export type CreateVectorStoreRequest = Omit<
  VectorStore,
  "_id" | "_rev" | "_deleted"
>
export type UpdateVectorStoreRequest = VectorStore
