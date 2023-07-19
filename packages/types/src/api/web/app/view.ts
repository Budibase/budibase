import { ViewV2 } from "../../../documents"

export interface ViewResponse {
  data: ViewV2
}

export type CreateViewRequest = Omit<
  ViewV2,
  "_id" | "_rev" | "createdAt" | "updatedAt" | "version" | "id"
>
