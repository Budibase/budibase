import { RelationshipTypes } from "constants/backend"
import { _ } from "../../../../lang/i18n"

const typeMismatch = $_(
  "components.backend.Datasource.relationshipErrors.foreign_match_primary"
)
const columnBeingUsed = $_(
  "components.backend.Datasource.relationshipErrors.Column-name"
)
const mustBeDifferentTables = $_(
  "components.backend.Datasource.relationshipErrors.different"
)
const primaryKeyNotSet = $_(
  "components.backend.Datasource.relationshipErrors.primary"
)
const throughNotNullable = $_(
  "components.backend.Datasource.relationshipErrors.Ensure"
)
const noRelationshipType = $_(
  "components.backend.Datasource.relationshipErrors.specify_relationship"
)
const tableNotSet = $_(
  "components.backend.Datasource.relationshipErrors.specify_table"
)
const foreignKeyNotSet = $_(
  "components.backend.Datasource.relationshipErrors.pick_foreign"
)
const relationshipAlreadyExists = $_(
  "components.backend.Datasource.relationshipErrors.relationship_tables"
)

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

  primaryKeySet(key) {
    return !this.isMany() && !key ? primaryKeyNotSet : null
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
