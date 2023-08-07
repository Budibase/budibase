// all added by grid/table when defining the
// column size, position and whether it can be viewed
import { FieldType } from "../row"
import { AutoReason, RelationshipType } from "./constants"

export interface UIFieldMetadata {
  order?: number
  width?: number
  visible?: boolean
  icon?: string
}

export interface RelationshipFieldMetadata {
  main?: boolean
  fieldName?: string
  tableId?: string
  // below is used for SQL relationships, needed to define the foreign keys
  // or the tables used for many-to-many relationships (through)
  relationshipType?: RelationshipType
  through?: string
  foreignKey?: string
  throughFrom?: string
  throughTo?: string
}

export interface AutoColumnFieldMetadata {
  autocolumn?: boolean
  subtype?: string
  lastID?: number
  // if the column was turned to an auto-column for SQL, explains why (primary, foreign etc)
  autoReason?: AutoReason
}

export interface NumberFieldMetadata {
  // used specifically when Budibase generates external tables, this denotes if a number field
  // is a foreign key used for a many-to-many relationship
  meta?: {
    toTable: string
    toKey: string
  }
}

export interface DateFieldMetadata {
  ignoreTimezones?: boolean
  timeOnly?: boolean
}

export interface StringFieldMetadata {
  useRichText?: boolean | null
}

export interface FormulaFieldMetadata {
  formula?: string
  formulaType?: string
}

export interface FieldConstraints {
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

export interface FieldSchema
  extends UIFieldMetadata,
    DateFieldMetadata,
    RelationshipFieldMetadata,
    AutoColumnFieldMetadata,
    StringFieldMetadata,
    FormulaFieldMetadata,
    NumberFieldMetadata {
  type: FieldType
  name: string
  sortable?: boolean
  // only used by external databases, to denote the real type
  externalType?: string
  constraints?: FieldConstraints
}

export interface TableSchema {
  [key: string]: FieldSchema
}
