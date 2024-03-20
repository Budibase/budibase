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
  extends BaseFieldSchema<
    AutoFieldSubType.CREATED_BY | AutoFieldSubType.UPDATED_BY | undefined
  > {
  type: FieldType.LINK
  main?: boolean
  fieldName: string
  tableId: string
  tableRev?: string
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
  extends BaseFieldSchema<AutoFieldSubType | undefined> {
  type: FieldType.AUTO
  autocolumn: true
  lastID?: number
  // if the column was turned to an auto-column for SQL, explains why (primary, foreign etc)
  autoReason?: AutoReason
}

export interface NumberFieldMetadata
  extends BaseFieldSchema<AutoFieldSubType.AUTO_ID | undefined> {
  type: FieldType.NUMBER
  lastID?: number
  autoReason?: AutoReason.FOREIGN_KEY
  // used specifically when Budibase generates external tables, this denotes if a number field
  // is a foreign key used for a many-to-many relationship
  meta?: {
    toTable: string
    toKey: string
  }
}

export interface JsonFieldMetadata
  extends BaseFieldSchema<JsonFieldSubType.ARRAY | undefined> {
  type: FieldType.JSON
}

export interface DateFieldMetadata
  extends BaseFieldSchema<
    AutoFieldSubType.CREATED_AT | AutoFieldSubType.UPDATED_AT | undefined
  > {
  type: FieldType.DATETIME
  ignoreTimezones?: boolean
  timeOnly?: boolean
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
  extends BaseFieldSchema<FieldSubtype.USER | FieldSubtype.USERS> {
  type: FieldType.BB_REFERENCE

  relationshipType?: RelationshipType
}

export interface AttachmentFieldMetadata
  extends BaseFieldSchema<FieldSubtype.SINGLE | undefined> {
  type: FieldType.ATTACHMENT
}

export interface FieldConstraints {
  type?: string
  email?: boolean
  inclusion?: string[]
  length?: {
    minimum?: string | number | null
    maximum?: string | number | null
    message?: string
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

interface BaseFieldSchema<TSubtype = never> extends UIFieldMetadata {
  type: FieldType
  name: string
  sortable?: boolean
  // only used by external databases, to denote the real type
  externalType?: string
  constraints?: FieldConstraints
  autocolumn?: boolean
  autoReason?: AutoReason.FOREIGN_KEY
  subtype: TSubtype
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
    | FieldType.ATTACHMENT
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
  | AttachmentFieldMetadata
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
