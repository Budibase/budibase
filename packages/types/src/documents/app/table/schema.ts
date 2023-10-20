// all added by grid/table when defining the
// column size, position and whether it can be viewed
import { FieldSubtype, FieldType } from "../row"
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

interface BaseRelationshipFieldMetadata
  extends Omit<BaseFieldSchema, "subtype"> {
  type: FieldType.LINK
  main?: boolean
  fieldName: string
  tableId: string
  subtype?: AutoFieldSubTypes.CREATED_BY | AutoFieldSubTypes.UPDATED_BY
}

// External tables use junction tables, internal tables don't require them
type ManyToManyJunctionTableMetadata =
  | {
      through: string
      throughFrom: string
      throughTo: string
    }
  | {
      through?: never
      throughFrom?: never
      throughTo?: never
    }

export type ManyToManyRelationshipFieldMetadata =
  BaseRelationshipFieldMetadata & {
    relationshipType: RelationshipType.MANY_TO_MANY
  } & ManyToManyJunctionTableMetadata

export interface OneToManyRelationshipFieldMetadata
  extends BaseRelationshipFieldMetadata {
  relationshipType: RelationshipType.ONE_TO_MANY
  foreignKey?: string
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

export interface AutoColumnFieldMetadata
  extends Omit<BaseFieldSchema, "subtype"> {
  type: FieldType.AUTO
  autocolumn: true
  subtype?: AutoFieldSubTypes
  lastID?: number
  // if the column was turned to an auto-column for SQL, explains why (primary, foreign etc)
  autoReason?: AutoReason
}

export interface NumberFieldMetadata extends Omit<BaseFieldSchema, "subtype"> {
  type: FieldType.NUMBER
  subtype?: AutoFieldSubTypes.AUTO_ID
  lastID?: number
  autoReason?: AutoReason.FOREIGN_KEY
  // used specifically when Budibase generates external tables, this denotes if a number field
  // is a foreign key used for a many-to-many relationship
  meta?: {
    toTable: string
    toKey: string
  }
}

export interface DateFieldMetadata extends Omit<BaseFieldSchema, "subtype"> {
  type: FieldType.DATETIME
  ignoreTimezones?: boolean
  timeOnly?: boolean
  subtype?: AutoFieldSubTypes.CREATED_AT | AutoFieldSubTypes.UPDATED_AT
}

export interface LongFormFieldMetadata extends BaseFieldSchema {
  type: FieldType.LONGFORM
  useRichText?: boolean | null
}

export interface FormulaFieldMetadata extends BaseFieldSchema {
  type: FieldType.FORMULA
  formula: string
  formulaType?: FormulaTypes
}

export interface BBReferenceFieldMetadata
  extends Omit<BaseFieldSchema, "subtype"> {
  type: FieldType.BB_REFERENCE
  subtype: FieldSubtype.USER | FieldSubtype.USERS
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
  subtype?: never
}

interface OtherFieldMetadata extends BaseFieldSchema {
  type: Exclude<
    FieldType,
    | FieldType.DATETIME
    | FieldType.LINK
    | FieldType.AUTO
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
  | FormulaFieldMetadata
  | NumberFieldMetadata
  | LongFormFieldMetadata
  | BBReferenceFieldMetadata

export interface TableSchema {
  [key: string]: FieldSchema
}
