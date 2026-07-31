import {
  BasicViewFieldMetadata,
  CalculationType,
  FieldSchema,
  FieldType,
  RelationSchemaField,
  SortField,
  Table,
  UIRow,
  UISearchFilter,
} from "@budibase/types"

export interface UITable extends Table {
  name: string
  id: string
  tableId: string
  primaryDisplay?: string
  sort?: SortField | SortField[]
  queryUI: UISearchFilter
  schema: Record<string, UIFieldSchema>
}

export type UIFieldSchema = FieldSchema &
  BasicViewFieldMetadata & {
    calculationType?: CalculationType
    cellRenderType?: string
    columns?: Record<string, UIRelationSchemaField>
    disabled?: boolean
    related?: { field: string; subField: string }
    format?: (row: UIRow) => any
  }

interface UIRelationSchemaField extends RelationSchemaField {
  type: FieldType
}
