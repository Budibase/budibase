const CouchDB = require("../../../db")
const {
  buildExternalTableId,
  breakExternalTableId,
} = require("../../../integrations/utils")
const { getTable } = require("./utils")
const {
  DataSourceOperation,
  FieldTypes,
  RelationshipTypes,
} = require("../../../constants")
const { makeExternalQuery } = require("../../../integrations/base/utils")
const { cloneDeep } = require("lodash/fp")

async function makeTableRequest(
  datasource,
  operation,
  table,
  tables,
  oldTable = null
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
          delete relatedSchema[relatedKey]
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

function generateRelatedSchema(linkColumn, table) {
  // generate column for other table
  const relatedSchema = cloneDeep(linkColumn)
  relatedSchema.fieldName = linkColumn.foreignKey
  relatedSchema.foreignKey = linkColumn.fieldName
  relatedSchema.relationshipType = RelationshipTypes.MANY_TO_ONE
  relatedSchema.tableId = table._id
  delete relatedSchema.main
  return relatedSchema
}

function oneToManyRelationshipNeedsSetup(column) {
  return (
    column.type === FieldTypes.LINK &&
    column.relationshipType === RelationshipTypes.ONE_TO_MANY &&
    !column.foreignKey
  )
}

exports.save = async function (ctx) {
  const appId = ctx.appId
  const table = ctx.request.body
  // can't do this
  delete table.dataImport
  const datasourceId = getDatasourceId(ctx.request.body)
  let tableToSave = {
    type: "table",
    _id: buildExternalTableId(datasourceId, table.name),
    ...table,
  }

  let oldTable
  if (ctx.request.body && ctx.request.body._id) {
    oldTable = await getTable(appId, ctx.request.body._id)
  }

  const db = new CouchDB(appId)
  const datasource = await db.get(datasourceId)
  const tables = datasource.entities

  // check if relations need setup
  for (let schema of Object.values(tableToSave.schema)) {
    // TODO: many to many handling
    if (oneToManyRelationshipNeedsSetup(schema)) {
      const relatedTable = Object.values(tables).find(
        table => table._id === schema.tableId
      )
      // setup the schema in this table
      const relatedField = schema.fieldName
      const relatedPrimary = relatedTable.primary[0]
      // generate a foreign key
      const foreignKey = `fk_${relatedTable.name}_${schema.fieldName}`

      schema.relationshipType = RelationshipTypes.ONE_TO_MANY
      schema.foreignKey = foreignKey
      schema.fieldName = relatedPrimary
      schema.main = true

      relatedTable.schema[relatedField] = generateRelatedSchema(schema, table)
      tableToSave.schema[foreignKey] = {
        type: FieldTypes.NUMBER,
        constraints: {},
      }
    }
  }

  cleanupRelationships(tableToSave, tables, oldTable)

  const operation = oldTable
    ? DataSourceOperation.UPDATE_TABLE
    : DataSourceOperation.CREATE_TABLE
  await makeTableRequest(datasource, operation, tableToSave, tables, oldTable)

  // store it into couch now for budibase reference
  datasource.entities[tableToSave.name] = tableToSave
  await db.put(datasource)

  return tableToSave
}

exports.destroy = async function (ctx) {
  const appId = ctx.appId
  const tableToDelete = await getTable(appId, ctx.params.tableId)
  const datasourceId = getDatasourceId(tableToDelete)

  const db = new CouchDB(appId)
  const datasource = await db.get(datasourceId)
  const tables = datasource.entities

  const operation = DataSourceOperation.DELETE_TABLE
  await makeTableRequest(datasource, operation, tableToDelete, tables)

  cleanupRelationships(tableToDelete, tables)

  delete datasource.entities[tableToDelete.name]
  await db.put(datasource)

  return tableToDelete
}
