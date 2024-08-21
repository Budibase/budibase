import { TableSchema, ViewV2 } from "../documents"

export interface ViewV2Enriched extends ViewV2 {
  schema?: TableSchema
}
