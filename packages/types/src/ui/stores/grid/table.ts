import {
  BasicViewFieldMetadata,
  FieldSchema,
  RelationSchemaField,
} from "@budibase/types"

export type UIFieldSchema = FieldSchema &
  BasicViewFieldMetadata & {
    related?: { field: string; subField: string }
    columns?: Record<string, RelationSchemaField & { type?: string }>
  }
