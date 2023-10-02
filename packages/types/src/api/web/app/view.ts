import { ViewV2, UIFieldMetadata } from "../../../documents"

export interface ViewResponse {
  data: ViewV2
}

export interface CreateViewRequest
  extends Omit<ViewV2, "version" | "id" | "schema"> {
  schema?: Record<string, UIFieldMetadata>
}

export interface UpdateViewRequest extends Omit<ViewV2, "schema"> {
  schema?: Record<string, UIFieldMetadata>
}
