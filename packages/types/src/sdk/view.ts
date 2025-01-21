import {
  FieldSchema,
  FieldSubType,
  FieldType,
  RelationSchemaField,
  ViewV2,
} from "../documents"

export interface ViewV2Enriched extends ViewV2 {
  schema?: {
    [key: string]: FieldSchema & {
      columns?: Record<string, ViewV2ColumnEnriched>
    }
  }
}

export interface ViewV2ColumnEnriched extends RelationSchemaField {
  type: FieldType
  subtype?: FieldSubType
}
