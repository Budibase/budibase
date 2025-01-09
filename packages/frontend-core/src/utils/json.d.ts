import { JsonFieldMetadata, QuerySchema } from "@budibase/types"

type Schema = Record<string, QuerySchema | string>

declare module "./json" {
  export const getJSONArrayDatasourceSchema: (
    tableSchema: Schema,
    datasource: any
  ) => Record<string, { type: string; name: string; prefixKeys: string }>

  export const generateQueryArraySchemas: (
    schema: Schema,
    nestedSchemaFields?: Record<string, Schema>
  ) => Schema

  export const convertJSONSchemaToTableSchema: (
    jsonSchema: JsonFieldMetadata,
    options: {
      squashObjects?: boolean
      prefixKeys?: string
    }
  ) => Record<string, { type: string; name: string; prefixKeys: string }>
}
