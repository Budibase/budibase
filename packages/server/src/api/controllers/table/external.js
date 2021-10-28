const CouchDB = require("../../../db")
const {
  buildExternalTableId,
  breakExternalTableId,
} = require("../../../integrations/utils")
const { getTable } = require("./utils")
const { DataSourceOperation, FieldTypes } = require("../../../constants")
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

function getDatasourceId(table) {
  if (!table) {
    throw "No table supplied"
  }
  if (table.sourceId) {
    return table.sourceId
  }
  return breakExternalTableId(table._id).datasourceId
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
  for (let [key, schema] of Object.entries(tableToSave.schema)) {
    // TODO: this assumes all relationships are the same, need to handle cardinality and many to many
    if (schema.type === FieldTypes.LINK) {
      const relatedTable = Object.values(tables).find(
        table => table._id === schema.tableId
      )
      const relatedField = schema.fieldName
      const foreignKey = `fk_${relatedTable.name}_${schema.fieldName}`
      // create foreign key
      tableToSave.schema[foreignKey] = { type: FieldTypes.NUMBER }
      // setup the relation in other table and this one
      schema.foreignKey = foreignKey
      schema.fieldName = foreignKey
      schema.main = true
      const relatedSchema = cloneDeep(schema)
      relatedSchema.fieldName = key
      delete relatedSchema.main
      relatedTable.schema[relatedField] = relatedSchema
    }
  }

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

  delete datasource.entities[tableToDelete.name]
  await db.put(datasource)

  return tableToDelete
}
