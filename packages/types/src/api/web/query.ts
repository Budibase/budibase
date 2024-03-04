import { QueryPreview, QuerySchema } from "../../documents"

export interface PreviewQueryRequest extends QueryPreview {}

export interface PreviewQueryResponse {
  rows: any[]
  nestedSchemaFields: { [key: string]: { [key: string]: string | QuerySchema } }
  schema: { [key: string]: string | QuerySchema }
  info: any
  extra: any
}

export interface ExecuteQueryRequest {
  parameters?: { [key: string]: string }
  pagination?: any
}

export interface ExecuteQueryResponse {
  data: Record<string, any>[]
}
