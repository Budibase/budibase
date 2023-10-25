import { Document } from "../../document"
import { View, ViewV2 } from "../view"
import { RenameColumn } from "../../../sdk"
import { TableSchema } from "./schema"

export const INTERNAL_TABLE_SOURCE_ID = "bb_internal"

export interface Table extends Document {
  type?: string
  views?: { [key: string]: View | ViewV2 }
  name: string
  sourceId: string
  primary?: string[]
  schema: TableSchema
  primaryDisplay?: string
  relatedFormula?: string[]
  constrained?: string[]
  sql?: boolean
  indexes?: { [key: string]: any }
  created?: boolean
  rowHeight?: number
}

export interface TableRequest extends Table {
  _rename?: RenameColumn
  created?: boolean
}
