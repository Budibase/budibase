import {
  BasicViewFieldMetadata,
  FieldSchema,
  FieldType,
  RelationSchemaField,
  SortOrder,
  Table,
  UIRow,
  UISearchFilter,
} from "@budibase/types"

export interface UITable extends Table {
  name: string
  id: string
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
    disabled?: boolean
    format?: (row: UIRow) => any
  }

interface UIRelationSchemaField extends RelationSchemaField {
  type: FieldType
}
