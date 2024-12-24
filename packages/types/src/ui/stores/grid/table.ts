import {
  BasicViewFieldMetadata,
  FieldSchema,
  FieldType,
  RelationSchemaField,
} from "@budibase/types"

export type UIFieldSchema = FieldSchema &
  BasicViewFieldMetadata & {
    related: { field: string; subField: string }
    columns?: Record<string, UIRelationSchemaField>
    cellRenderType?: string
  }

interface UIRelationSchemaField extends RelationSchemaField {
  type: FieldType
}
