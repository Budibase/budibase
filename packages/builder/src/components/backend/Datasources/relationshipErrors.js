import { RelationshipType } from "@budibase/types"

const typeMismatch = "Column type of the foreign key must match the primary key"
const columnBeingUsed = "Column name cannot be an existing column"
const mustBeDifferentTables = "From/to/through tables must be different"
const mustBeDifferentColumns = "Foreign keys must be different"
const primaryKeyNotSet = "Please pick the primary key"
const throughNotNullable =
  "Ensure non-key columns are nullable or auto-generated"
const noRelationshipType = "Please specify a relationship type"
const tableNotSet = "Please specify a table"
const foreignKeyNotSet = "Please pick a foreign key"
const relationshipAlreadyExists =
  "A relationship between these tables already exists"

function isColumnNameBeingUsed(table, columnName, originalName) {
  if (!table || !columnName || columnName === originalName) {
    return false
  }
  const keys = Object.keys(table.schema).map(key => key.toLowerCase())
  return keys.indexOf(columnName.toLowerCase()) !== -1
}

function typeMismatchCheck(fromTable, toTable, primary, foreign) {
  let fromType, toType
  if (primary && foreign) {
    fromType = fromTable?.schema[primary]?.type
    toType = toTable?.schema[foreign]?.type
  }
  return fromType && toType && fromType !== toType ? typeMismatch : null
}

export class RelationshipErrorChecker {
  constructor(invalidThroughTableFn, manyToManyRelationshipExistsFn) {
    this.invalidThroughTable = invalidThroughTableFn
    this.manyToManyRelationshipExists = manyToManyRelationshipExistsFn
  }

  setType(type) {
    this.type = type
  }

  isMany() {
    return this.type === RelationshipType.MANY_TO_MANY
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

  primaryKeySet(key) {
    return !this.isMany() && !key ? primaryKeyNotSet : null
  }

  throughIsNullable() {
    return this.invalidThroughTable() ? throughNotNullable : null
  }

  doesRelationshipExists() {
    return this.isMany() && this.manyToManyRelationshipExists()
      ? relationshipAlreadyExists
      : null
  }

  differentTables(table1, table2, table3) {
    // currently don't support relationships back onto the table itself, needs to relate out
    const error = table1 && (table1 === table2 || (table3 && table1 === table3))
    return error ? mustBeDifferentTables : null
  }

  differentColumns(columnA, columnB) {
    const error = columnA && columnB && columnA === columnB
    return error ? mustBeDifferentColumns : null
  }

  columnBeingUsed(table, column, ogName) {
    return isColumnNameBeingUsed(table, column, ogName) ? columnBeingUsed : null
  }

  typeMismatch(fromTable, toTable, primary, foreign) {
    if (this.isMany()) {
      return null
    }
    return typeMismatchCheck(fromTable, toTable, primary, foreign)
  }

  manyTypeMismatch(table, throughTable, primary, foreign) {
    if (!this.isMany()) {
      return null
    }
    return typeMismatchCheck(table, throughTable, primary, foreign)
  }
}
