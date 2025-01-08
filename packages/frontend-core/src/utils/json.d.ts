import { QuerySchema } from "@budibase/types"

type Schema = Record<string, QuerySchema | string>

export const getJSONArrayDatasourceSchema: (
  tableSchema: Schema,
  datasource: any
) => Record<string, { type: string; name: string; prefixKeys: string }>

export const generateQueryArraySchemas: (
  schema: Schema,
  nestedSchemaFields?: Record<string, Schema>
) => Schema
