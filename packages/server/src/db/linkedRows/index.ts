import LinkController from "./LinkController"
import {
  getLinkDocuments,
  getLinkedTable,
  getLinkedTableIDs,
  getRelatedTableForField,
  getUniqueByProp,
} from "./linkUtils"
import flatten from "lodash/flatten"
import { USER_METDATA_PREFIX } from "../utils"
import partition from "lodash/partition"
import { getGlobalUsersFromMetadata } from "../../utilities/global"
import {
  coreOutputProcessing,
  processFormulas,
} from "../../utilities/rowProcessor"
import { context } from "@budibase/backend-core"
import {
  ContextUser,
  EventType,
  FieldType,
  LinkDocumentValue,
  Row,
  Table,
  TableSchema,
  ViewV2,
  ViewV2Schema,
} from "@budibase/types"
import sdk from "../../sdk"
import { helpers } from "@budibase/shared-core"

export { IncludeDocs, getLinkDocuments, createLinkView } from "./linkUtils"

const INVALID_DISPLAY_COLUMN_TYPE = [
  FieldType.LINK,
  FieldType.ATTACHMENTS,
  FieldType.ATTACHMENT_SINGLE,
  FieldType.SIGNATURE_SINGLE,
  FieldType.BB_REFERENCE,
  FieldType.BB_REFERENCE_SINGLE,
]

/**
 * This functionality makes sure that when rows with links are created, updated or deleted they are processed
 * correctly - making sure that no stale links are left around and that all links have been made successfully.
 */
export { EventType } from "@budibase/types"

function clearRelationshipFields(schema: TableSchema, rows: Row[]) {
  for (let [key, field] of Object.entries(schema)) {
    if (field.type === FieldType.LINK) {
      rows = rows.map(row => {
        delete row[key]
        return row
      })
    }
  }
  return rows
}

async function getLinksForRows(rows: Row[]): Promise<LinkDocumentValue[]> {
  const tableIds = [...new Set(rows.map(el => el.tableId))]
  // start by getting all the link values for performance reasons
  const promises = tableIds.map(tableId =>
    getLinkDocuments({
      tableId: tableId,
    })
  )
  const responses = flatten(await Promise.all(promises))
  // have to get unique as the previous table query can
  // return duplicates, could be querying for both tables in a relation
  return getUniqueByProp(
    responses
      .filter(el => el != null)
      // create a unique ID which we can use for getting only unique ones
      .map(el => ({ ...el, unique: el.id + el.thisId + el.fieldName })),
    "unique"
  )
}

async function getFullLinkedDocs(links: LinkDocumentValue[]) {
  // create DBs
  const db = context.getAppDB()
  const linkedRowIds = links.map(link => link.id)
  const uniqueRowIds = [...new Set(linkedRowIds)]
  let dbRows = await db.getMultiple<Row>(uniqueRowIds, { allowMissing: true })
  // convert the unique db rows back to a full list of linked rows
  const linked = linkedRowIds
    .map(id => dbRows.find(row => row && row._id === id))
    .filter(row => row != null) as Row[]
  // need to handle users as specific cases
  let [users, other] = partition(linked, linkRow =>
    linkRow._id!.startsWith(USER_METDATA_PREFIX)
  )
  users = await getGlobalUsersFromMetadata(users as ContextUser[])
  return [...other, ...users]
}

/**
 * Update link documents for a row or table - this is to be called by the API controller when a change is occurring.
 * @param args.eventType states what type of change which is occurring, means this can be expanded upon in the
 * future quite easily (all updates go through one function).
 * @param args.tableId The ID of the of the table which is being changed.
 * @param args.row The row which is changing, e.g. created, updated or deleted.
 * @param args.table If the table has already been retrieved this can be used to reduce database gets.
 * @param args.oldTable If the table is being updated then the old table can be provided for differencing.
 * @returns When the update is complete this will respond successfully. Returns the row for
 * row operations and the table for table operations.
 */
export async function updateLinks(args: {
  tableId?: string
  eventType: string
  row?: Row
  table?: Table
  oldTable?: Table
}) {
  const { eventType, row, tableId, table, oldTable } = args
  const baseReturnObj = row == null ? table : row
  // make sure table ID is set
  if (tableId == null && table != null) {
    args.tableId = table._id!
  }
  let linkController = new LinkController(args)
  try {
    if (
      !(await linkController.doesTableHaveLinkedFields(table)) &&
      (oldTable == null ||
        !(await linkController.doesTableHaveLinkedFields(oldTable)))
    ) {
      return baseReturnObj
    }
  } catch (err) {
    return baseReturnObj
  }
  switch (eventType) {
    case EventType.ROW_SAVE:
    case EventType.ROW_UPDATE:
      return await linkController.rowSaved()
    case EventType.ROW_DELETE:
      return await linkController.rowDeleted()
    case EventType.TABLE_SAVE:
      return await linkController.tableSaved()
    case EventType.TABLE_UPDATED:
      return await linkController.tableUpdated()
    case EventType.TABLE_DELETE:
      return await linkController.tableDeleted()
    default:
      throw "Type of event is not known, linked row handler requires update."
  }
}

/**
 * Given a table and a list of rows this will retrieve all of the attached docs and enrich them into the row.
 * This is required for formula fields, this may only be utilised internally (for now).
 * @return returns the rows with all of the enriched relationships on it.
 */
export async function attachFullLinkedDocs(
  schema: TableSchema,
  rows: Row[],
  opts?: { fromRow?: Row }
) {
  const linkedTableIds = getLinkedTableIDs(schema)
  if (linkedTableIds.length === 0) {
    return rows
  }
  // get tables and links
  let response = await Promise.all([
    getLinksForRows(rows),
    sdk.tables.getTables(linkedTableIds),
  ])
  // find the links that pertain to one of the rows that is being enriched
  const links = (response[0] as LinkDocumentValue[]).filter(link =>
    rows.some(row => row._id === link.thisId)
  )
  // if fromRow has been passed in, then we don't need to fetch it (optimisation)
  let linksWithoutFromRow = links
  if (opts?.fromRow) {
    linksWithoutFromRow = links.filter(link => link.id !== opts?.fromRow?._id)
  }
  const linkedTables = response[1] as Table[]
  // clear any existing links that could be dupe'd
  rows = clearRelationshipFields(schema, rows)
  // now get the docs and combine into the rows
  let linked: Row[] = []
  if (linksWithoutFromRow.length > 0) {
    linked = await getFullLinkedDocs(linksWithoutFromRow)
  }
  for (let row of rows) {
    for (let link of links.filter(link => link.thisId === row._id)) {
      if (row[link.fieldName] == null) {
        row[link.fieldName] = []
      }
      let linkedRow: Row
      if (opts?.fromRow && opts?.fromRow?._id === link.id) {
        linkedRow = opts.fromRow!
      } else {
        linkedRow = linked.find(row => row._id === link.id)!
      }
      if (linkedRow) {
        const linkedTableId =
          linkedRow.tableId || getRelatedTableForField(schema, link.fieldName)
        const linkedTable = linkedTables.find(
          table => table._id === linkedTableId
        )
        if (linkedTable) {
          const processed = await processFormulas(linkedTable, linkedRow)
          row[link.fieldName].push(processed)
        }
      }
    }
  }
  return rows
}

/**
 * Finds a valid value for the primary display, avoiding columns which break things
 * like relationships (can be circular).
 * @param row The row to lift a value from for the primary display.
 * @param table The related table to attempt to work out the primary display column from.
 */
function getPrimaryDisplayValue(row: Row, table?: Table) {
  const primaryDisplay = table?.primaryDisplay
  let invalid = true
  if (primaryDisplay) {
    const primaryDisplaySchema = table?.schema[primaryDisplay]
    invalid = INVALID_DISPLAY_COLUMN_TYPE.includes(primaryDisplaySchema.type)
  }
  if (invalid || !primaryDisplay) {
    const validKey = Object.keys(table?.schema || {}).find(
      key =>
        table?.schema[key].type &&
        !INVALID_DISPLAY_COLUMN_TYPE.includes(table?.schema[key].type)
    )
    return validKey ? row[validKey] : undefined
  } else {
    return row[primaryDisplay]
  }
}

export type SquashTableFields = Record<string, { visibleFieldNames: string[] }>

/**
 * This function will take the given enriched rows and squash the links to only
 * contain the primary display field.
 *
 * @returns The rows after having their links squashed to only contain the ID
 * and primary display.
 */
export async function squashLinks<T = Row[] | Row>(
  source: Table | ViewV2,
  enriched: T
): Promise<T> {
  let viewSchema: ViewV2Schema = {}
  if (sdk.views.isView(source)) {
    if (helpers.views.isCalculationView(source)) {
      return enriched
    }

    viewSchema = source.schema || {}
  }

  let table: Table
  if (sdk.views.isView(source)) {
    table = await sdk.views.getTable(source.id)
  } else {
    table = source
  }

  // will populate this as we find them
  const linkedTables = [table]
  const isArray = Array.isArray(enriched)
  const enrichedArray = !isArray ? [enriched as Row] : (enriched as Row[])
  for (const row of enrichedArray) {
    // this only fetches the table if its not already in array
    const rowTable = await getLinkedTable(row.tableId!, linkedTables)
    for (let [column, schema] of Object.entries(rowTable.schema)) {
      if (schema.type !== FieldType.LINK || !Array.isArray(row[column])) {
        continue
      }
      const relatedTable = await getLinkedTable(schema.tableId, linkedTables)
      if (viewSchema[column]?.columns) {
        row[column] = await coreOutputProcessing(relatedTable, row[column])
      }
      row[column] = row[column].map((link: Row) => {
        const obj: any = { _id: link._id }
        obj.primaryDisplay = getPrimaryDisplayValue(link, relatedTable)

        if (viewSchema[column]?.columns) {
          const squashFields = Object.entries(viewSchema[column].columns || {})
            .filter(([columnName, viewColumnConfig]) => {
              const tableColumn = relatedTable.schema[columnName]
              if (!tableColumn) {
                return false
              }
              if (
                [FieldType.LINK, FieldType.FORMULA, FieldType.AI].includes(
                  tableColumn.type
                )
              ) {
                return false
              }
              return (
                tableColumn.visible !== false &&
                viewColumnConfig.visible !== false
              )
            })

            .map(([columnName]) => columnName)

          for (const relField of squashFields) {
            if (link[relField] != null) {
              obj[relField] = link[relField]
            }
          }
        }

        return obj
      })
    }
  }
  return (isArray ? enrichedArray : enrichedArray[0]) as T
}
