// all added by grid/table when defining the
// column size, position and whether it can be viewed
import { FieldType } from "../row"
import {
  AutoFieldSubTypes,
  AutoReason,
  FormulaTypes,
  RelationshipType,
} from "./constants"

export interface UIFieldMetadata {
  order?: number
  width?: number
  visible?: boolean
  icon?: string
}

interface BaseRelationshipFieldMetadata extends BaseFieldSchema {
  type: FieldType.LINK
  main?: boolean
  fieldName?: string
  tableId: string
}
export interface ManyToManyRelationshipFieldMetadata
  extends BaseRelationshipFieldMetadata {
  relationshipType: RelationshipType.MANY_TO_MANY
  through: string
  throughFrom: string
  throughTo: string
}
export interface OneToManyRelationshipFieldMetadata
  extends BaseRelationshipFieldMetadata {
  relationshipType: RelationshipType.ONE_TO_MANY
  foreignKey: string
}
export interface ManyToOneRelationshipFieldMetadata
  extends BaseRelationshipFieldMetadata {
  relationshipType: RelationshipType.MANY_TO_ONE
  foreignKey?: string
}
export type RelationshipFieldMetadata =
  | ManyToManyRelationshipFieldMetadata
  | OneToManyRelationshipFieldMetadata
  | ManyToOneRelationshipFieldMetadata

export interface AutoColumnFieldMetadata extends BaseFieldSchema {
  type: FieldType.AUTO
  autocolumn: true
  subtype: AutoFieldSubTypes
  lastID?: number
  // if the column was turned to an auto-column for SQL, explains why (primary, foreign etc)
  autoReason?: AutoReason
}

export interface NumberFieldMetadata extends BaseFieldSchema {
  type: FieldType.NUMBER
  autocolumn?: boolean
  subtype?: AutoFieldSubTypes.AUTO_ID
  autoReason?: AutoReason.FOREIGN_KEY
  // used specifically when Budibase generates external tables, this denotes if a number field
  // is a foreign key used for a many-to-many relationship
  meta?: {
    toTable: string
    toKey: string
  }
}

export interface DateFieldMetadata extends BaseFieldSchema {
  type: FieldType.DATETIME
  ignoreTimezones?: boolean
  timeOnly?: boolean
}

export interface StringFieldMetadata extends BaseFieldSchema {
  type: FieldType.STRING
}

export interface LongFormFieldMetadata extends BaseFieldSchema {
  type: FieldType.LONGFORM
  useRichText?: boolean | null
}

export interface FormulaFieldMetadata extends BaseFieldSchema {
  type: FieldType.FORMULA
  formula?: string
  formulaType?: FormulaTypes
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

interface BaseFieldSchema extends UIFieldMetadata {
  type: FieldType
  name: string
  sortable?: boolean
  // only used by external databases, to denote the real type
  externalType?: string
  constraints?: FieldConstraints
  autocolumn?: boolean
  autoReason?: AutoReason.FOREIGN_KEY
  subtype?: string
}

interface OtherFieldMetadata extends BaseFieldSchema {
  type: Exclude<
    FieldType,
    | FieldType.DATETIME
    | FieldType.LINK
    | FieldType.AUTO
    | FieldType.STRING
    | FieldType.FORMULA
    | FieldType.NUMBER
    | FieldType.LONGFORM
  >
}

export type FieldSchema =
  | OtherFieldMetadata
  | DateFieldMetadata
  | RelationshipFieldMetadata
  | AutoColumnFieldMetadata
  | StringFieldMetadata
  | FormulaFieldMetadata
  | NumberFieldMetadata
  | LongFormFieldMetadata

export interface TableSchema {
  [key: string]: FieldSchema
}
