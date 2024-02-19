// all added by grid/table when defining the
// column size, position and whether it can be viewed
import { FieldSubtype, FieldType } from "../row"
import {
  AutoFieldSubType,
  AutoReason,
  FormulaType,
  JsonFieldSubType,
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
  tableRev?: string
  subtype?: AutoFieldSubType.CREATED_BY | AutoFieldSubType.UPDATED_BY
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
  subtype?: AutoFieldSubType
  lastID?: number
  // if the column was turned to an auto-column for SQL, explains why (primary, foreign etc)
  autoReason?: AutoReason
}

export interface NumberFieldMetadata extends Omit<BaseFieldSchema, "subtype"> {
  type: FieldType.NUMBER
  subtype?: AutoFieldSubType.AUTO_ID
  lastID?: number
  autoReason?: AutoReason.FOREIGN_KEY
  // used specifically when Budibase generates external tables, this denotes if a number field
  // is a foreign key used for a many-to-many relationship
  meta?: {
    toTable: string
    toKey: string
  }
}

export interface JsonFieldMetadata extends Omit<BaseFieldSchema, "subtype"> {
  type: FieldType.JSON
  subtype?: JsonFieldSubType.ARRAY
}

export interface DateFieldMetadata extends Omit<BaseFieldSchema, "subtype"> {
  type: FieldType.DATETIME
  ignoreTimezones?: boolean
  timeOnly?: boolean
  subtype?: AutoFieldSubType.CREATED_AT | AutoFieldSubType.UPDATED_AT
}

export interface LongFormFieldMetadata extends BaseFieldSchema {
  type: FieldType.LONGFORM
  useRichText?: boolean | null
}

export interface FormulaFieldMetadata extends BaseFieldSchema {
  type: FieldType.FORMULA
  formula: string
  formulaType?: FormulaType
}

export interface BBReferenceFieldMetadata
  extends Omit<BaseFieldSchema, "subtype"> {
  type: FieldType.BB_REFERENCE
  subtype: FieldSubtype.USER | FieldSubtype.USERS
  relationshipType?: RelationshipType
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
  | JsonFieldMetadata

export interface TableSchema {
  [key: string]: FieldSchema
}

export function isRelationshipField(
  field: FieldSchema
): field is RelationshipFieldMetadata {
  return field.type === FieldType.LINK
}

export function isManyToMany(
  field: RelationshipFieldMetadata
): field is ManyToManyRelationshipFieldMetadata {
  return field.relationshipType === RelationshipType.MANY_TO_MANY
}

export function isOneToMany(
  field: RelationshipFieldMetadata
): field is OneToManyRelationshipFieldMetadata {
  return field.relationshipType === RelationshipType.ONE_TO_MANY
}

export function isManyToOne(
  field: RelationshipFieldMetadata
): field is ManyToOneRelationshipFieldMetadata {
  return field.relationshipType === RelationshipType.MANY_TO_ONE
}

export function isBBReferenceField(
  field: FieldSchema
): field is BBReferenceFieldMetadata {
  return field.type === FieldType.BB_REFERENCE
}
