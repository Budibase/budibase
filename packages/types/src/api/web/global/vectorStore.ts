import { VectorDb } from "../../../documents"

export type VectorDbListResponse = VectorDb[]
export type CreateVectorDbRequest = Omit<VectorDb, "_id" | "_rev" | "_deleted">
export type UpdateVectorDbRequest = VectorDb
