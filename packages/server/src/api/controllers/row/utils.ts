import { InternalTables } from "../../../db/utils"
import * as userController from "../user"
import { context } from "@budibase/backend-core"
import {
  Ctx,
  FieldType,
  ManyToOneRelationshipFieldMetadata,
  OneToManyRelationshipFieldMetadata,
  Row,
  SearchFilters,
  Table,
  UserCtx,
} from "@budibase/types"
import { FieldTypes, NoEmptyFilterStrings } from "../../../constants"
import sdk from "../../../sdk"

import validateJs from "validate.js"
import { cloneDeep } from "lodash/fp"

function isForeignKey(key: string, table: Table) {
  const relationships = Object.values(table.schema).filter(
    column => column.type === FieldType.LINK
  )
  return relationships.some(
    relationship =>
      (
        relationship as
          | OneToManyRelationshipFieldMetadata
          | ManyToOneRelationshipFieldMetadata
      ).foreignKey === key
  )
}

validateJs.extend(validateJs.validators.datetime, {
  parse: function (value: string) {
    return new Date(value).getTime()
  },
  // Input is a unix timestamp
  format: function (value: string) {
    return new Date(value).toISOString()
  },
})

export async function findRow(ctx: UserCtx, tableId: string, rowId: string) {
  const db = context.getAppDB()
  let row: Row
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

export function getTableId(ctx: Ctx) {
  // top priority, use the URL first
  if (ctx.params?.sourceId) {
    return ctx.params.sourceId
  }
  // now check for old way of specifying table ID
  if (ctx.params?.tableId) {
    return ctx.params.tableId
  }
  // check body for a table ID
  if (ctx.request.body?.tableId) {
    return ctx.request.body.tableId
  }
  // now check if a specific view name
  if (ctx.params?.viewName) {
    return ctx.params.viewName
  }
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
    fetchedTable = await sdk.tables.getTable(tableId)
  } else {
    fetchedTable = table
  }
  const errors: any = {}
  for (let fieldName of Object.keys(fetchedTable.schema)) {
    const column = fetchedTable.schema[fieldName]
    const constraints = cloneDeep(column.constraints)
    const type = column.type
    // foreign keys are likely to be enriched
    if (isForeignKey(fieldName, fetchedTable)) {
      continue
    }
    // formulas shouldn't validated, data will be deleted anyway
    if (type === FieldTypes.FORMULA || column.autocolumn) {
      continue
    }
    // special case for options, need to always allow unselected (empty)
    if (type === FieldTypes.OPTIONS && constraints?.inclusion) {
      constraints.inclusion.push(null as any, "")
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
            !constraints?.inclusion?.includes(val) &&
            constraints?.inclusion?.length !== 0
          ) {
            errors[fieldName] = "Field not in list"
          }
        })
      } else if (constraints?.presence && row[fieldName].length === 0) {
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

// don't do a pure falsy check, as 0 is included
// https://github.com/Budibase/budibase/issues/10118
export function removeEmptyFilters(filters: SearchFilters) {
  for (let filterField of NoEmptyFilterStrings) {
    if (!filters[filterField]) {
      continue
    }

    for (let filterType of Object.keys(filters)) {
      if (filterType !== filterField) {
        continue
      }
      // don't know which one we're checking, type could be anything
      const value = filters[filterType] as unknown
      if (typeof value === "object") {
        for (let [key, value] of Object.entries(
          filters[filterType] as object
        )) {
          if (value == null || value === "") {
            // @ts-ignore
            delete filters[filterField][key]
          }
        }
      }
    }
  }
  return filters
}

export function isUserMetadataTable(tableId: string) {
  return tableId === InternalTables.USER_METADATA
}
