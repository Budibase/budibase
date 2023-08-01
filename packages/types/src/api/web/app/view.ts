import { ViewV2, UIFieldMetadata } from "../../../documents"

export interface ViewResponse {
  data: ViewV2
}

export interface CreateViewRequest
  extends Omit<ViewV2, "version" | "id" | "columns" | "schemaUI"> {
  schema?: Record<string, UIFieldMetadata>
}

export interface UpdateViewRequest
  extends Omit<ViewV2, "columns" | "schemaUI"> {
  schema?: Record<string, UIFieldMetadata>
}
