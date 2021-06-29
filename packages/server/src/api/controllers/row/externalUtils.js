const {
  breakExternalTableId,
  generateRowIdField,
  breakRowIdField,
} = require("../../../integrations/utils")
const { FieldTypes } = require("../../../constants")
const { cloneDeep } = require("lodash/fp")

exports.inputProcessing = (row, table, allTables) => {
  if (!row) {
    return { row, manyRelationships: [] }
  }
  let newRow = {}, manyRelationships = []
  for (let [key, field] of Object.entries(table.schema)) {
    // currently excludes empty strings
    if (!row[key]) {
      continue
    }
    const isLink = field.type === FieldTypes.LINK
    if (isLink && !field.through) {
      // we don't really support composite keys for relationships, this is why [0] is used
      newRow[key] = breakRowIdField(row[key][0])[0]
    } else if (isLink && field.through) {
      const linkTable = allTables.find(table => table._id === field.tableId)
      // table has to exist for many to many
      if (!linkTable) {
        continue
      }
      row[key].map(relationship => {
        // we don't really support composite keys for relationships, this is why [0] is used
        manyRelationships.push({
          tableId: field.through,
          [linkTable.primary]: breakRowIdField(relationship)[0],
          // leave the ID for enrichment later
          [table.primary]: `{{ id }}`,
        })
      })
    } else {
      newRow[key] = row[key]
    }
  }
  return { row: newRow, manyRelationships }
}

exports.generateIdForRow = (row, table) => {
  if (!row) {
    return
  }
  const primary = table.primary
  // build id array
  let idParts = []
  for (let field of primary) {
    idParts.push(row[field])
  }
  return generateRowIdField(idParts)
}

exports.updateRelationshipColumns = (rows, row, relationships, allTables) => {
  const columns = {}
  for (let relationship of relationships) {
    const linkedTable = allTables[relationship.tableName]
    if (!linkedTable) {
      continue
    }
    const display = linkedTable.primaryDisplay
    const related = {}
    if (display && row[display]) {
      related.primaryDisplay = row[display]
    }
    related._id = row[relationship.to]
    columns[relationship.column] = related
  }
  for (let [column, related] of Object.entries(columns)) {
    if (!Array.isArray(rows[row._id][column])) {
      rows[row._id][column] = []
    }
    // make sure relationship hasn't been found already
    if (!rows[row._id][column].find(relation => relation._id === related._id)) {
      rows[row._id][column].push(related)
    }
  }
  return rows
}

exports.outputProcessing = (rows, table, relationships, allTables) => {
  // if no rows this is what is returned? Might be PG only
  if (rows[0].read === true) {
    return []
  }
  let finalRows = {}
  for (let row of rows) {
    row._id = exports.generateIdForRow(row, table)
    // this is a relationship of some sort
    if (finalRows[row._id]) {
      finalRows = exports.updateRelationshipColumns(
        finalRows,
        row,
        relationships,
        allTables
      )
      continue
    }
    const thisRow = {}
    // filter the row down to what is actually the row (not joined)
    for (let fieldName of Object.keys(table.schema)) {
      thisRow[fieldName] = row[fieldName]
    }
    thisRow._id = row._id
    thisRow.tableId = table._id
    thisRow._rev = "rev"
    finalRows[thisRow._id] = thisRow
    // do this at end once its been added to the final rows
    finalRows = exports.updateRelationshipColumns(
      finalRows,
      row,
      relationships,
      allTables
    )
  }
  return Object.values(finalRows)
}

exports.buildFilters = (id, filters, table) => {
  const primary = table.primary
  // if passed in array need to copy for shifting etc
  let idCopy = cloneDeep(id)
  if (filters) {
    // need to map over the filters and make sure the _id field isn't present
    for (let filter of Object.values(filters)) {
      if (filter._id) {
        const parts = breakRowIdField(filter._id)
        for (let field of primary) {
          filter[field] = parts.shift()
        }
      }
      // make sure this field doesn't exist on any filter
      delete filter._id
    }
  }
  // there is no id, just use the user provided filters
  if (!idCopy || !table) {
    return filters
  }
  // if used as URL parameter it will have been joined
  if (typeof idCopy === "string") {
    idCopy = breakRowIdField(idCopy)
  }
  const equal = {}
  for (let field of primary) {
    // work through the ID and get the parts
    equal[field] = idCopy.shift()
  }
  return {
    equal,
  }
}

exports.buildRelationships = (table, allTables) => {
  const relationships = []
  for (let [fieldName, field] of Object.entries(table.schema)) {
    if (field.type !== FieldTypes.LINK) {
      continue
    }
    const { tableName: linkTableName } = breakExternalTableId(field.tableId)
    // no table to link to, this is not a valid relationships
    if (!allTables[linkTableName]) {
      continue
    }
    const linkTable = allTables[linkTableName]
    const definition = {
      // if no foreign key specified then use the name of the field in other table
      from: field.foreignKey || table.primary[0],
      to: field.fieldName,
      tableName: linkTableName,
      through: undefined,
      // need to specify where to put this back into
      column: fieldName,
    }
    if (field.through) {
      const { tableName: throughTableName } = breakExternalTableId(field.through)
      definition.through = throughTableName
      // don't support composite keys for relationships
      definition.from = table.primary[0]
      definition.to = linkTable.primary[0]
    }
    relationships.push(definition)
  }
  return relationships
}
