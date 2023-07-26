import { TableSchema, ViewV2 } from "../../../documents"

export interface ViewResponse {
  data: ViewV2
}

export type CreateViewRequest = Omit<ViewV2, "version" | "id">

export type UpdateViewRequest = ViewV2
