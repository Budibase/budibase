import { FieldSchema, RelationSchemaField, ViewV2 } from "../documents"

export interface ViewV2Enriched extends ViewV2 {
  schema?: {
    [key: string]: FieldSchema & {
      columns?: Record<string, ViewV2ColumnEnriched>
    }
  }
}

export type ViewV2ColumnEnriched = RelationSchemaField & FieldSchema
