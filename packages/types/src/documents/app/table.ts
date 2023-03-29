import { Document } from "../document"
import { View } from "./view"
import { RenameColumn } from "../../sdk"
import { FieldType } from "./row"

export enum RelationshipTypes {
  ONE_TO_MANY = "one-to-many",
  MANY_TO_ONE = "many-to-one",
  MANY_TO_MANY = "many-to-many",
}

export interface FieldSchema {
  type: FieldType
  externalType?: string
  fieldName?: string
  name: string
  sortable?: boolean
  tableId?: string
  relationshipType?: RelationshipTypes
  through?: string
  foreignKey?: string
  icon?: string
  autocolumn?: boolean
  subtype?: string
  throughFrom?: string
  throughTo?: string
  formula?: string
  formulaType?: string
  main?: boolean
  ignoreTimezones?: boolean
  timeOnly?: boolean
  lastID?: number
  useRichText?: boolean | null
  meta?: {
    toTable: string
    toKey: string
  }
  constraints?: {
    type?: string
    email?: boolean
    inclusion?: string[]
    length?: {
      minimum?: string | number | null
      maximum?: string | number | null
    }
    numericality?: {
      greaterThanOrEqualTo: string | null
      lessThanOrEqualTo: string | null
    }
    presence?:
      | boolean
      | {
          allowEmpty?: boolean
        }
    datetime?: {
      latest: string
      earliest: string
    }
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
  rows?: { [key: string]: any }
}

export interface TableRequest extends Table {
  _rename?: RenameColumn
  created?: boolean
}
