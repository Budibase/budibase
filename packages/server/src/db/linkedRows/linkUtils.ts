import { ViewName, getQueryIndex, isRelationshipColumn } from "../utils"
import { FieldTypes } from "../../constants"
import { createLinkView } from "../views/staticViews"
import { context, logging } from "@budibase/backend-core"
import { LinkDocument, LinkDocumentValue, Table } from "@budibase/types"

export { createLinkView } from "../views/staticViews"

/**
 * Only needed so that boolean parameters are being used for includeDocs
 * @type {{EXCLUDE: boolean, INCLUDE: boolean}}
 */
export const IncludeDocs = {
  INCLUDE: true,
  EXCLUDE: false,
}

/**
 * Gets the linking documents, not the linked documents themselves.
 * @param {string} args.tableId The table which we are searching for linked rows against.
 * @param {string|null} args.fieldName The name of column/field which is being altered, only looking for
 * linking documents that are related to it. If this is not specified then the table level will be assumed.
 * @param {string|null} args.rowId The ID of the row which we want to find linking documents for -
 * if this is not specified then it will assume table or field level depending on whether the
 * field name has been specified.
 * @param {boolean|null} args.includeDocs whether to include docs in the response call, this is considerably slower so only
 * use this if actually interested in the docs themselves.
 * @returns {Promise<object[]>} This will return an array of the linking documents that were found
 * (if any).
 */
export async function getLinkDocuments(args: {
  tableId?: string
  rowId?: string
  includeDocs?: any
}): Promise<LinkDocumentValue[] | LinkDocument[]> {
  const { tableId, rowId, includeDocs } = args
  const db = context.getAppDB()
  let params: any
  if (rowId != null) {
    params = { key: [tableId, rowId] }
  }
  // only table is known
  else {
    params = { startKey: [tableId], endKey: [tableId, {}] }
  }
  params.include_docs = !!includeDocs
  try {
    let linkRows = (await db.query(getQueryIndex(ViewName.LINK), params)).rows
    // filter to get unique entries
    const foundIds: string[] = []
    linkRows = linkRows.filter(link => {
      // make sure anything unique is the correct key
      if (
        (tableId && link.key[0] !== tableId) ||
        (rowId && link.key[1] !== rowId)
      ) {
        return false
      }
      const unique = foundIds.indexOf(link.id) === -1
      if (unique) {
        foundIds.push(link.id)
      }
      return unique
    })

    if (includeDocs) {
      return linkRows.map(row => row.doc) as LinkDocument[]
    } else {
      return linkRows.map(row => row.value) as LinkDocumentValue[]
    }
  } catch (err: any) {
    // check if the view doesn't exist, it should for all new instances
    if (err != null && err.name === "not_found") {
      await createLinkView()
      return getLinkDocuments(arguments[0])
    } else {
      /* istanbul ignore next */
      logging.logAlert("Failed to get link documents", err)
      throw err
    }
  }
}

export function getUniqueByProp(array: any[], prop: string) {
  return array.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
  })
}

export function getLinkedTableIDs(table: Table) {
  return Object.values(table.schema)
    .filter(isRelationshipColumn)
    .map(column => column.tableId)
}

export async function getLinkedTable(id: string, tables: Table[]) {
  const db = context.getAppDB()
  let linkedTable = tables.find(table => table._id === id)
  if (linkedTable) {
    return linkedTable
  }
  linkedTable = await db.get(id)
  if (linkedTable) {
    tables.push(linkedTable)
  }
  return linkedTable
}

export function getRelatedTableForField(table: Table, fieldName: string) {
  // look to see if its on the table, straight in the schema
  const field = table.schema[fieldName]
  if (field?.type === FieldTypes.LINK) {
    return field.tableId
  }
  for (let column of Object.values(table.schema)) {
    if (column.type === FieldTypes.LINK && column.fieldName === fieldName) {
      return column.tableId
    }
  }
  return null
}
