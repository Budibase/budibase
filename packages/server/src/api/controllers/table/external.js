const {
  buildExternalTableId,
  breakExternalTableId,
} = require("../../../integrations/utils")
const {
  generateForeignKey,
  generateJunctionTableName,
  foreignKeyStructure,
  hasTypeChanged,
} = require("./utils")
const {
  DataSourceOperation,
  FieldTypes,
  RelationshipTypes,
} = require("../../../constants")
const { makeExternalQuery } = require("../../../integrations/base/query")
const { cloneDeep } = require("lodash/fp")
const csvParser = require("../../../utilities/csvParser")
const { handleRequest } = require("../row/external")
const { getAppDB } = require("@budibase/backend-core/context")
const { events } = require("@budibase/backend-core")
const sdk = require("../../../sdk")

async function makeTableRequest(
  datasource,
  operation,
  table,
  tables,
  oldTable = null,
  renamed = null
) {
  const json = {
    endpoint: {
      datasourceId: datasource._id,
      entityId: table._id,
      operation,
    },
    meta: {
      tables,
    },
    table,
  }
  if (oldTable) {
    json.meta.table = oldTable
  }
  if (renamed) {
    json.meta.renamed = renamed
  }
  return makeExternalQuery(datasource, json)
}

function cleanupRelationships(table, tables, oldTable = null) {
  const tableToIterate = oldTable ? oldTable : table
  // clean up relationships in couch table schemas
  for (let [key, schema] of Object.entries(tableToIterate.schema)) {
    if (
      schema.type === FieldTypes.LINK &&
      (!oldTable || table.schema[key] == null)
    ) {
      const relatedTable = Object.values(tables).find(
        table => table._id === schema.tableId
      )
      const foreignKey = schema.foreignKey
      if (!relatedTable || !foreignKey) {
        continue
      }
      for (let [relatedKey, relatedSchema] of Object.entries(
        relatedTable.schema
      )) {
        if (
          relatedSchema.type === FieldTypes.LINK &&
          relatedSchema.fieldName === foreignKey
        ) {
          delete relatedTable.schema[relatedKey]
        }
      }
    }
  }
}

function getDatasourceId(table) {
  if (!table) {
    throw "No table supplied"
  }
  if (table.sourceId) {
    return table.sourceId
  }
  return breakExternalTableId(table._id).datasourceId
}

function otherRelationshipType(type) {
  if (type === RelationshipTypes.MANY_TO_MANY) {
    return RelationshipTypes.MANY_TO_MANY
  }
  return type === RelationshipTypes.ONE_TO_MANY
    ? RelationshipTypes.MANY_TO_ONE
    : RelationshipTypes.ONE_TO_MANY
}

function generateManyLinkSchema(datasource, column, table, relatedTable) {
  const primary = table.name + table.primary[0]
  const relatedPrimary = relatedTable.name + relatedTable.primary[0]
  const jcTblName = generateJunctionTableName(column, table, relatedTable)
  // first create the new table
  const junctionTable = {
    _id: buildExternalTableId(datasource._id, jcTblName),
    name: jcTblName,
    primary: [primary, relatedPrimary],
    constrained: [primary, relatedPrimary],
    schema: {
      [primary]: foreignKeyStructure(primary, {
        toTable: table.name,
        toKey: table.primary[0],
      }),
      [relatedPrimary]: foreignKeyStructure(relatedPrimary, {
        toTable: relatedTable.name,
        toKey: relatedTable.primary[0],
      }),
    },
  }
  column.through = junctionTable._id
  column.throughFrom = relatedPrimary
  column.throughTo = primary
  column.fieldName = relatedPrimary
  return junctionTable
}

function generateLinkSchema(column, table, relatedTable, type) {
  const isOneSide = type === RelationshipTypes.ONE_TO_MANY
  const primary = isOneSide ? relatedTable.primary[0] : table.primary[0]
  // generate a foreign key
  const foreignKey = generateForeignKey(column, relatedTable)
  column.relationshipType = type
  column.foreignKey = isOneSide ? foreignKey : primary
  column.fieldName = isOneSide ? primary : foreignKey
  return foreignKey
}

function generateRelatedSchema(linkColumn, table, relatedTable, columnName) {
  // generate column for other table
  const relatedSchema = cloneDeep(linkColumn)
  // swap them from the main link
  if (linkColumn.foreignKey) {
    relatedSchema.fieldName = linkColumn.foreignKey
    relatedSchema.foreignKey = linkColumn.fieldName
  }
  // is many to many
  else {
    // don't need to copy through, already got it
    relatedSchema.fieldName = linkColumn.throughTo
    relatedSchema.throughTo = linkColumn.throughFrom
    relatedSchema.throughFrom = linkColumn.throughTo
  }
  relatedSchema.relationshipType = otherRelationshipType(
    linkColumn.relationshipType
  )
  relatedSchema.tableId = relatedTable._id
  relatedSchema.name = columnName
  table.schema[columnName] = relatedSchema
}

function isRelationshipSetup(column) {
  return column.foreignKey || column.through
}

exports.save = async function (ctx) {
  const table = ctx.request.body
  const { _rename: renamed } = table
  // can't do this right now
  delete table.dataImport
  const datasourceId = getDatasourceId(ctx.request.body)
  // table doesn't exist already, note that it is created
  if (!table._id) {
    table.created = true
  }
  let tableToSave = {
    type: "table",
    _id: buildExternalTableId(datasourceId, table.name),
    ...table,
  }

  let oldTable
  if (ctx.request.body && ctx.request.body._id) {
    oldTable = await sdk.tables.getTable(ctx.request.body._id)
  }

  if (hasTypeChanged(tableToSave, oldTable)) {
    ctx.throw(400, "A column type has changed.")
  }

  const db = getAppDB()
  const datasource = await db.get(datasourceId)
  if (!datasource.entities) {
    datasource.entities = {}
  }
  const oldTables = cloneDeep(datasource.entities)
  const tables = datasource.entities

  const extraTablesToUpdate = []

  // check if relations need setup
  for (let schema of Object.values(tableToSave.schema)) {
    if (schema.type !== FieldTypes.LINK || isRelationshipSetup(schema)) {
      continue
    }
    const relatedTable = Object.values(tables).find(
      table => table._id === schema.tableId
    )
    const relatedColumnName = schema.fieldName
    const relationType = schema.relationshipType
    if (relationType === RelationshipTypes.MANY_TO_MANY) {
      const junctionTable = generateManyLinkSchema(
        datasource,
        schema,
        table,
        relatedTable
      )
      if (tables[junctionTable.name]) {
        throw "Junction table already exists, cannot create another relationship."
      }
      tables[junctionTable.name] = junctionTable
      extraTablesToUpdate.push(junctionTable)
    } else {
      const fkTable =
        relationType === RelationshipTypes.ONE_TO_MANY ? table : relatedTable
      const foreignKey = generateLinkSchema(
        schema,
        table,
        relatedTable,
        relationType
      )
      fkTable.schema[foreignKey] = foreignKeyStructure(foreignKey)
      if (fkTable.constrained == null) {
        fkTable.constrained = []
      }
      if (fkTable.constrained.indexOf(foreignKey) === -1) {
        fkTable.constrained.push(foreignKey)
      }
      // foreign key is in other table, need to save it to external
      if (fkTable._id !== table._id) {
        extraTablesToUpdate.push(fkTable)
      }
    }
    generateRelatedSchema(schema, relatedTable, table, relatedColumnName)
    schema.main = true
  }

  cleanupRelationships(tableToSave, tables, oldTable)

  const operation = oldTable
    ? DataSourceOperation.UPDATE_TABLE
    : DataSourceOperation.CREATE_TABLE
  await makeTableRequest(
    datasource,
    operation,
    tableToSave,
    tables,
    oldTable,
    renamed
  )
  // update any extra tables (like foreign keys in other tables)
  for (let extraTable of extraTablesToUpdate) {
    const oldExtraTable = oldTables[extraTable.name]
    let op = oldExtraTable
      ? DataSourceOperation.UPDATE_TABLE
      : DataSourceOperation.CREATE_TABLE
    await makeTableRequest(datasource, op, extraTable, tables, oldExtraTable)
  }

  // make sure the constrained list, all still exist
  if (Array.isArray(tableToSave.constrained)) {
    tableToSave.constrained = tableToSave.constrained.filter(constraint =>
      Object.keys(tableToSave.schema).includes(constraint)
    )
  }

  // remove the rename prop
  delete tableToSave._rename
  // store it into couch now for budibase reference
  datasource.entities[tableToSave.name] = tableToSave
  await db.put(datasource)

  return tableToSave
}

exports.destroy = async function (ctx) {
  const tableToDelete = await sdk.tables.getTable(ctx.params.tableId)
  if (!tableToDelete || !tableToDelete.created) {
    ctx.throw(400, "Cannot delete tables which weren't created in Budibase.")
  }
  const datasourceId = getDatasourceId(tableToDelete)

  const db = getAppDB()
  const datasource = await db.get(datasourceId)
  const tables = datasource.entities

  const operation = DataSourceOperation.DELETE_TABLE
  await makeTableRequest(datasource, operation, tableToDelete, tables)

  cleanupRelationships(tableToDelete, tables)

  delete datasource.entities[tableToDelete.name]
  await db.put(datasource)

  return tableToDelete
}

exports.bulkImport = async function (ctx) {
  const table = await sdk.tables.getTable(ctx.params.tableId)
  const { dataImport } = ctx.request.body
  if (!dataImport || !dataImport.schema || !dataImport.csvString) {
    ctx.throw(400, "Provided data import information is invalid.")
  }
  const rows = await csvParser.transform({
    ...dataImport,
    existingTable: table,
  })
  await handleRequest(DataSourceOperation.BULK_CREATE, table._id, {
    rows,
  })
  await events.rows.imported(table, "csv", rows.length)
  return table
}
