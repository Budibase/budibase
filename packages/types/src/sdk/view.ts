import { FieldSchema, RelationSchemaField, ViewV2 } from "../documents"

export interface ViewV2Enriched extends ViewV2 {
  schema?: {
    [key: string]: FieldSchema & {
      columns?: Record<string, RelationSchemaField>
    }
  }
}
