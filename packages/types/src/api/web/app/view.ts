import { ViewV2, FieldSchema } from "../../../documents"

export interface ViewResponse {
  data: ViewV2
}

export interface CreateViewRequest
  extends Omit<ViewV2, "version" | "id" | "columns" | "schemaUI"> {
  schema?: Record<string, FieldSchema>
}

export interface UpdateViewRequest
  extends Omit<ViewV2, "columns" | "schemaUI"> {
  schema?: Record<string, FieldSchema>
}
