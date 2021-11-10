const validateJs = require("validate.js")
const { cloneDeep } = require("lodash/fp")
const CouchDB = require("../../../db")
const { InternalTables } = require("../../../db/utils")
const userController = require("../user")
const { FieldTypes } = require("../../../constants")
const { processStringSync } = require("@budibase/string-templates")
const { makeExternalQuery } = require("../../../integrations/base/utils")

validateJs.extend(validateJs.validators.datetime, {
  parse: function (value) {
    return new Date(value).getTime()
  },
  // Input is a unix timestamp
  format: function (value) {
    return new Date(value).toISOString()
  },
})

exports.getDatasourceAndQuery = async (appId, json) => {
  const datasourceId = json.endpoint.datasourceId
  const db = new CouchDB(appId)
  const datasource = await db.get(datasourceId)
  return makeExternalQuery(datasource, json)
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
      table.schema[fieldName].type ===
        (FieldTypes.OPTIONS || FieldTypes.ARRAY) &&
      constraints.inclusion
    ) {
      constraints.inclusion.push(null)
    }
    let res

    // Validate.js doesn't seem to handle array
    if (
      table.schema[fieldName].type === FieldTypes.ARRAY &&
      row[fieldName] &&
      row[fieldName].length
    ) {
      row[fieldName].map(val => {
        if (!constraints.inclusion.includes(val)) {
          errors[fieldName] = "Field not in list"
        }
      })
    } else if (table.schema[fieldName].type === FieldTypes.FORMULA) {
      res = validateJs.single(
        processStringSync(table.schema[fieldName].formula, row),
        constraints
      )
    } else {
      res = validateJs.single(row[fieldName], constraints)
    }
    if (res) errors[fieldName] = res
  }
  return { valid: Object.keys(errors).length === 0, errors }
}
