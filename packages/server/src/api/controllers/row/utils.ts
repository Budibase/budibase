import { InternalTables } from "../../../db/utils"
import * as userController from "../user"
import { FieldTypes } from "../../../constants"
import { context } from "@budibase/backend-core"
import { makeExternalQuery } from "../../../integrations/base/query"
import { BBContext, Row, Table } from "@budibase/types"
export { removeKeyNumbering } from "../../../integrations/base/utils"
const validateJs = require("validate.js")
const { cloneDeep } = require("lodash/fp")

validateJs.extend(validateJs.validators.datetime, {
  parse: function (value: string) {
    return new Date(value).getTime()
  },
  // Input is a unix timestamp
  format: function (value: string) {
    return new Date(value).toISOString()
  },
})

export async function getDatasourceAndQuery(json: any) {
  const datasourceId = json.endpoint.datasourceId
  const db = context.getAppDB()
  const datasource = await db.get(datasourceId)
  return makeExternalQuery(datasource, json)
}

export async function findRow(ctx: BBContext, tableId: string, rowId: string) {
  const db = context.getAppDB()
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

export async function validate({
  tableId,
  row,
  table,
}: {
  tableId?: string
  row: Row
  table?: Table
}) {
  let fetchedTable: Table
  if (!table) {
    const db = context.getAppDB()
    fetchedTable = await db.get(tableId)
  } else {
    fetchedTable = table
  }
  const errors: any = {}
  for (let fieldName of Object.keys(fetchedTable.schema)) {
    const constraints = cloneDeep(fetchedTable.schema[fieldName].constraints)
    const type = fetchedTable.schema[fieldName].type
    // formulas shouldn't validated, data will be deleted anyway
    if (type === FieldTypes.FORMULA) {
      continue
    }
    // special case for options, need to always allow unselected (null)
    if (type === FieldTypes.OPTIONS && constraints.inclusion) {
      constraints.inclusion.push(null)
    }
    let res

    // Validate.js doesn't seem to handle array
    if (type === FieldTypes.ARRAY && row[fieldName]) {
      if (row[fieldName].length) {
        if (!Array.isArray(row[fieldName])) {
          row[fieldName] = row[fieldName].split(",")
        }
        row[fieldName].map((val: any) => {
          if (
            !constraints.inclusion.includes(val) &&
            constraints.inclusion.length !== 0
          ) {
            errors[fieldName] = "Field not in list"
          }
        })
      } else if (constraints.presence && row[fieldName].length === 0) {
        // non required MultiSelect creates an empty array, which should not throw errors
        errors[fieldName] = [`${fieldName} is required`]
      }
    } else if (
      (type === FieldTypes.ATTACHMENT || type === FieldTypes.JSON) &&
      typeof row[fieldName] === "string"
    ) {
      // this should only happen if there is an error
      try {
        const json = JSON.parse(row[fieldName])
        if (type === FieldTypes.ATTACHMENT) {
          if (Array.isArray(json)) {
            row[fieldName] = json
          } else {
            errors[fieldName] = [`Must be an array`]
          }
        }
      } catch (err) {
        errors[fieldName] = [`Contains invalid JSON`]
      }
    } else {
      res = validateJs.single(row[fieldName], constraints)
    }
    if (res) errors[fieldName] = res
  }
  return { valid: Object.keys(errors).length === 0, errors }
}
