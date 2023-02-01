import { RelationshipTypes } from "constants/backend"

export const typeMismatch =
  "Column type of the foreign key must match the primary key"
export const columnCantExist = "Column name cannot be an existing column"
export const mustBeDifferentTables = "From/to/through tables must be different"
export const primaryKeyNotSet = "Please pick the primary key"
export const throughNotNullable =
  "Ensure non-key columns are nullable or auto-generated"
export const noRelationshipType = "Please specify a relationship type"
export const tableNotSet = "Please specify a table"
export const foreignKeyNotSet = "Please pick a foreign key"
export const relationshipAlreadyExists =
  "A relationship between these tables already exists"

function isColumnNameBeingUsed(table, columnName, originalName) {
  if (!table || !columnName || columnName === originalName) {
    return false
  }
  const keys = Object.keys(table.schema).map(key => key.toLowerCase())
  return keys.indexOf(columnName.toLowerCase()) !== -1
}

export class RelationshipErrorChecker {
  constructor(invalidThroughTableFn, relationshipExistsFn) {
    this.invalidThroughTable = invalidThroughTableFn
    this.relationshipExists = relationshipExistsFn
  }

  setType(type) {
    this.type = type
  }

  isMany() {
    return this.type === RelationshipTypes.MANY_TO_MANY
  }

  relationshipTypeSet(type) {
    return !type ? noRelationshipType : null
  }

  tableSet(table) {
    return !table ? tableNotSet : null
  }

  throughTableSet(table) {
    return this.isMany() && !table ? tableNotSet : null
  }

  manyForeignKeySet(key) {
    return this.isMany() && !key ? foreignKeyNotSet : null
  }

  foreignKeySet(key) {
    return !this.isMany() && !key ? foreignKeyNotSet : null
  }

  throughIsNullable() {
    return this.invalidThroughTable() ? throughNotNullable : null
  }

  doesRelationshipExists() {
    return this.isMany() && this.relationshipExists()
      ? relationshipAlreadyExists
      : null
  }

  differentTables(table1, table2, table3) {
    // currently don't support relationships back onto the table itself, needs to relate out
    const error = table1 && (table1 === table2 || (table3 && table1 === table3))
    return error ? mustBeDifferentTables : null
  }

  columnBeingUsed(table, column, ogName) {
    return isColumnNameBeingUsed(table, column, ogName) ? columnCantExist : null
  }

  typeMismatch(fromTable, toTable, primary, foreign) {
    let fromType, toType
    if (primary && foreign) {
      fromType = fromTable?.schema[primary]?.type
      toType = toTable?.schema[foreign]?.type
    }
    return fromType && toType && fromType !== toType ? typeMismatch : null
  }
}
