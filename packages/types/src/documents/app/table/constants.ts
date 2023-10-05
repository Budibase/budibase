export enum RelationshipType {
  ONE_TO_MANY = "one-to-many",
  MANY_TO_ONE = "many-to-one",
  MANY_TO_MANY = "many-to-many",
}

export enum AutoReason {
  FOREIGN_KEY = "foreign_key",
}

export enum AutoFieldSubTypes {
  CREATED_BY = "createdBy",
  CREATED_AT = "createdAt",
  UPDATED_BY = "updatedBy",
  UPDATED_AT = "updatedAt",
  AUTO_ID = "autoID",
}

export enum FormulaTypes {
  STATIC = "static",
  DYNAMIC = "dynamic",
}
