import {
  BasicViewFieldMetadata,
  FieldSchema,
  FieldType,
  RelationSchemaField,
  SortOrder,
  Table,
  UISearchFilter,
} from "@budibase/types"

export interface UITable extends Omit<Table, "type"> {
  name: string
  id: string
  type: string
  tableId: string
  primaryDisplay?: string
  sort?: {
    field: string
    order: SortOrder
  }
  queryUI: UISearchFilter
  schema: Record<string, UIFieldSchema>
}

export type UIFieldSchema = FieldSchema &
  BasicViewFieldMetadata & {
    related?: { field: string; subField: string }
    columns?: Record<string, UIRelationSchemaField>
    cellRenderType?: string
  }

interface UIRelationSchemaField extends RelationSchemaField {
  type: FieldType
}
