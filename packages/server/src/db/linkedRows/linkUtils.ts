import { ViewName, getQueryIndex, isRelationshipColumn } from "../utils"
import { createLinkView } from "../views/staticViews"
import { context, logging } from "@budibase/backend-core"
import {
  FieldType,
  DatabaseQueryOpts,
  LinkDocument,
  LinkDocumentValue,
  Table,
  TableSchema,
} from "@budibase/types"
import sdk from "../../sdk"

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
 * @param args.tableId The table which we are searching for linked rows against.
 * @param args.fieldName The name of column/field which is being altered, only looking for
 * linking documents that are related to it. If this is not specified then the table level will be assumed.
 * @param args.rowId The ID of the row which we want to find linking documents for -
 * if this is not specified then it will assume table or field level depending on whether the
 * field name has been specified.
 * @param args.includeDocs whether to include docs in the response call, this is considerably slower so only
 * use this if actually interested in the docs themselves.
 * @returns This will return an array of the linking documents that were found
 * (if any).
 */
export function getLinkDocuments(args: {
  tableId?: string
  rowId?: string
  fieldName?: string
  includeDocs: boolean
}): Promise<LinkDocument[]>
export function getLinkDocuments(args: {
  tableId?: string
  rowId?: string
  fieldName?: string
}): Promise<LinkDocumentValue[]>
export async function getLinkDocuments(args: {
  tableId?: string
  rowId?: string
  fieldName?: string
  includeDocs?: boolean
}): Promise<LinkDocumentValue[] | LinkDocument[]> {
  const { tableId, rowId, fieldName, includeDocs } = args
  const db = context.getAppDB()
  let params: DatabaseQueryOpts
  if (rowId) {
    params = { key: [tableId, rowId] }
  }
  // only table is known
  else {
    params = { startkey: [tableId], endkey: [tableId, {}] }
  }
  if (includeDocs) {
    params.include_docs = true
  }
  try {
    let linkRows = (await db.query(getQueryIndex(ViewName.LINK), params)).rows
    // filter to get unique entries
    const foundIds = new Set()
    linkRows = linkRows.filter(link => {
      // make sure anything unique is the correct key
      if (
        (tableId && link.key[0] !== tableId) ||
        (rowId && link.key[1] !== rowId)
      ) {
        return false
      }
      const unique = !foundIds.has(link.id)
      if (unique) {
        foundIds.add(link.id)
      }
      return unique
    })

    // filter down to just the required field name
    if (fieldName) {
      linkRows = linkRows.filter(link => {
        const value = link.value as LinkDocumentValue
        return value.fieldName === fieldName
      })
    }
    // return docs if docs requested, otherwise just the value information
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
  const seen = new Set()
  const filteredArray = []
  for (const item of array) {
    if (!seen.has(item[prop])) {
      seen.add(item[prop])
      filteredArray.push(item)
    }
  }
  return filteredArray
}

export function getLinkedTableIDs(schema: TableSchema): string[] {
  return Object.values(schema)
    .filter(isRelationshipColumn)
    .map(column => column.tableId)
}

export async function getLinkedTable(id: string, tables: Table[]) {
  let linkedTable = tables.find(table => table._id === id)
  if (linkedTable) {
    return linkedTable
  }
  linkedTable = await sdk.tables.getTable(id)
  if (linkedTable) {
    tables.push(linkedTable)
  }
  return linkedTable
}

export function getRelatedTableForField(
  schema: TableSchema,
  fieldName: string
) {
  // look to see if its on the table, straight in the schema
  const field = schema[fieldName]
  if (field?.type === FieldType.LINK) {
    return field.tableId
  }
  for (let column of Object.values(schema)) {
    if (column.type === FieldType.LINK && column.fieldName === fieldName) {
      return column.tableId
    }
  }
  return null
}
