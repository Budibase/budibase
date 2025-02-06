import { FieldType } from "../row"

export enum RelationshipType {
  ONE_TO_MANY = "one-to-many",
  MANY_TO_ONE = "many-to-one",
  MANY_TO_MANY = "many-to-many",
}

export enum AutoReason {
  FOREIGN_KEY = "foreign_key",
}

export type FieldSubType =
  | AutoFieldSubType
  | JsonFieldSubType
  | BBReferenceFieldSubType

export enum AutoFieldSubType {
  CREATED_BY = "createdBy",
  CREATED_AT = "createdAt",
  UPDATED_BY = "updatedBy",
  UPDATED_AT = "updatedAt",
  AUTO_ID = "autoID",
}

export enum JsonFieldSubType {
  ARRAY = "array",
}

export enum FormulaType {
  STATIC = "static",
  DYNAMIC = "dynamic",
  AI = "ai",
}

export enum BBReferenceFieldSubType {
  USER = "user",
  /** @deprecated this should not be used anymore, left here in order to support the existing usages */
  USERS = "users",
}

export type SupportedSqlTypes =
  | FieldType.STRING
  | FieldType.BARCODEQR
  | FieldType.LONGFORM
  | FieldType.OPTIONS
  | FieldType.DATETIME
  | FieldType.NUMBER
  | FieldType.BOOLEAN
  | FieldType.FORMULA
  | FieldType.BIGINT
  | FieldType.BB_REFERENCE
  | FieldType.BB_REFERENCE_SINGLE
  | FieldType.LINK
  | FieldType.ARRAY
