const validateJs = require("validate.js")
const { cloneDeep } = require("lodash/fp")
const CouchDB = require("../../../db")
const { InternalTables } = require("../../../db/utils")
const userController = require("../user")
const { FieldTypes } = require("../../../constants")
const { integrations } = require("../../../integrations")

validateJs.extend(validateJs.validators.datetime, {
  parse: function (value) {
    return new Date(value).getTime()
  },
  // Input is a unix timestamp
  format: function (value) {
    return new Date(value).toISOString()
  },
})

exports.makeExternalQuery = async (appId, json) => {
  const datasourceId = json.endpoint.datasourceId
  const database = new CouchDB(ctx.appId)
  const datasource = await database.get(datasourceId)
  const Integration = integrations[datasource.source]
  // query is the opinionated function
  if (Integration.prototype.query) {
    const integration = new Integration(datasource.config)
    return integration.query(json)
  } else {
    throw "Datasource does not support query."
  }
}

exports.findRow = async (ctx, db, tableId, rowId) => {
  let row
  // TODO remove special user case in future
  if (tableId === InternalTables.USER_METADATA) {
    ctx.params = {
      id: rowId,
    }
    await userController.findMetadata(ctx)
    row = ctx.body
  } else {
    row = await db.get(rowId)
  }
  if (row.tableId !== tableId) {
    throw "Supplied tableId does not match the rows tableId"
  }
  return row
}

exports.validate = async ({ appId, tableId, row, table }) => {
  if (!table) {
    const db = new CouchDB(appId)
    table = await db.get(tableId)
  }
  const errors = {}
  for (let fieldName of Object.keys(table.schema)) {
    const constraints = cloneDeep(table.schema[fieldName].constraints)
    // special case for options, need to always allow unselected (null)
    if (
      table.schema[fieldName].type === FieldTypes.OPTIONS &&
      constraints.inclusion
    ) {
      constraints.inclusion.push(null)
    }
    const res = validateJs.single(row[fieldName], constraints)
    if (res) errors[fieldName] = res
  }
  return { valid: Object.keys(errors).length === 0, errors }
}
