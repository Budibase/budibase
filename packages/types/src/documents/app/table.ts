import { Document } from "../document"
import { View } from "./view"

export interface FieldSchema {
  // TODO: replace with field types enum when done
  type: string
  externalType?: string
  fieldName?: string
  name: string
  tableId?: string
  relationshipType?: string
  through?: string
  foreignKey?: string
  autocolumn?: boolean
  subtype?: string
  throughFrom?: string
  throughTo?: string
  formula?: string
  formulaType?: string
  main?: boolean
  ignoreTimezones?: boolean
  meta?: {
    toTable: string
    toKey: string
  }
  constraints?: {
    type?: string
    email?: boolean
    inclusion?: string[]
    length?: {
      minimum?: string | number
      maximum?: string | number
    }
    presence?: boolean
  }
}

export interface TableSchema {
  [key: string]: FieldSchema
}

export interface Table extends Document {
  type?: string
  views?: { [key: string]: View }
  name: string
  primary?: string[]
  schema: TableSchema
  primaryDisplay?: string
  sourceId?: string
  relatedFormula?: string[]
  constrained?: string[]
  sql?: boolean
  indexes?: { [key: string]: any }
  dataImport?: { [key: string]: any }
}
