const LinkController = require("./LinkController")
const {
  IncludeDocs,
  getLinkDocuments,
  createLinkView,
  getUniqueByProp,
  getRelatedTableForField,
  getLinkedTableIDs,
  getLinkedTable,
} = require("./linkUtils")
const { flatten } = require("lodash")
const { FieldTypes } = require("../../constants")
const { getMultiIDParams, USER_METDATA_PREFIX } = require("../../db/utils")
const { partition } = require("lodash")
const { getGlobalUsersFromMetadata } = require("../../utilities/global")
const { processFormulas } = require("../../utilities/rowProcessor/utils")
const { getAppDB } = require("@budibase/backend-core/context")

/**
 * This functionality makes sure that when rows with links are created, updated or deleted they are processed
 * correctly - making sure that no stale links are left around and that all links have been made successfully.
 */

const EventType = {
  ROW_SAVE: "row:save",
  ROW_UPDATE: "row:update",
  ROW_DELETE: "row:delete",
  TABLE_SAVE: "table:save",
  TABLE_UPDATED: "table:updated",
  TABLE_DELETE: "table:delete",
}

exports.EventType = EventType
// re-export search here for ease of use
exports.IncludeDocs = IncludeDocs
exports.getLinkDocuments = getLinkDocuments
exports.createLinkView = createLinkView

function clearRelationshipFields(table, rows) {
  for (let [key, field] of Object.entries(table.schema)) {
    if (field.type === FieldTypes.LINK) {
      rows = rows.map(row => {
        delete row[key]
        return row
      })
    }
  }
  return rows
}

async function getLinksForRows(rows) {
  const tableIds = [...new Set(rows.map(el => el.tableId))]
  // start by getting all the link values for performance reasons
  const responses = flatten(
    await Promise.all(
      tableIds.map(tableId =>
        getLinkDocuments({
          tableId: tableId,
          includeDocs: IncludeDocs.EXCLUDE,
        })
      )
    )
  )
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

async function getFullLinkedDocs(links) {
  // create DBs
  const db = getAppDB()
  const linkedRowIds = links.map(link => link.id)
  const uniqueRowIds = [...new Set(linkedRowIds)]
  let dbRows = (await db.allDocs(getMultiIDParams(uniqueRowIds))).rows.map(
    row => row.doc
  )
  // convert the unique db rows back to a full list of linked rows
  const linked = linkedRowIds
    .map(id => dbRows.find(row => row && row._id === id))
    .filter(row => row != null)
  // need to handle users as specific cases
  let [users, other] = partition(linked, linkRow =>
    linkRow._id.startsWith(USER_METDATA_PREFIX)
  )
  users = await getGlobalUsersFromMetadata(users)
  return [...other, ...users]
}

/**
 * Update link documents for a row or table - this is to be called by the API controller when a change is occurring.
 * @param {string} args.eventType states what type of change which is occurring, means this can be expanded upon in the
 * future quite easily (all updates go through one function).
 * @param {string} args.tableId The ID of the of the table which is being changed.
 * @param {object|undefined} args.row The row which is changing, e.g. created, updated or deleted.
 * @param {object|undefined} args.table If the table has already been retrieved this can be used to reduce database gets.
 * @param {object|undefined} args.oldTable If the table is being updated then the old table can be provided for differencing.
 * @returns {Promise<object>} When the update is complete this will respond successfully. Returns the row for
 * row operations and the table for table operations.
 */
exports.updateLinks = async function (args) {
  const { eventType, row, tableId, table, oldTable } = args
  const baseReturnObj = row == null ? table : row
  // make sure table ID is set
  if (tableId == null && table != null) {
    args.tableId = table._id
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
 * @param {object} table The table from which the rows originated.
 * @param {array<object>} rows The rows which are to be enriched.
 * @return {Promise<*>} returns the rows with all of the enriched relationships on it.
 */
exports.attachFullLinkedDocs = async (table, rows) => {
  const linkedTableIds = getLinkedTableIDs(table)
  if (linkedTableIds.length === 0) {
    return rows
  }
  // get all the links
  const links = (await getLinksForRows(rows)).filter(link =>
    rows.some(row => row._id === link.thisId)
  )
  // clear any existing links that could be dupe'd
  rows = clearRelationshipFields(table, rows)
  // now get the docs and combine into the rows
  let linked = await getFullLinkedDocs(links)
  const linkedTables = []
  for (let row of rows) {
    for (let link of links.filter(link => link.thisId === row._id)) {
      if (row[link.fieldName] == null) {
        row[link.fieldName] = []
      }
      const linkedRow = linked.find(row => row._id === link.id)
      if (linkedRow) {
        const linkedTableId =
          linkedRow.tableId || getRelatedTableForField(table, link.fieldName)
        const linkedTable = await getLinkedTable(linkedTableId, linkedTables)
        if (linkedTable) {
          row[link.fieldName].push(processFormulas(linkedTable, linkedRow))
        }
      }
    }
  }
  return rows
}

/**
 * This function will take the given enriched rows and squash the links to only contain the primary display field.
 * @param {object} table The table from which the rows originated.
 * @param {array<object>} enriched The pre-enriched rows (full docs) which are to be squashed.
 * @returns {Promise<Array>} The rows after having their links squashed to only contain the ID and primary display.
 */
exports.squashLinksToPrimaryDisplay = async (table, enriched) => {
  // will populate this as we find them
  const linkedTables = [table]
  for (let row of enriched) {
    // this only fetches the table if its not already in array
    const rowTable = await getLinkedTable(row.tableId, linkedTables)
    for (let [column, schema] of Object.entries(rowTable.schema)) {
      if (schema.type !== FieldTypes.LINK || !Array.isArray(row[column])) {
        continue
      }
      const newLinks = []
      for (let link of row[column]) {
        const linkTblId = link.tableId || getRelatedTableForField(table, column)
        const linkedTable = await getLinkedTable(linkTblId, linkedTables)
        const obj = { _id: link._id }
        if (link[linkedTable.primaryDisplay]) {
          obj.primaryDisplay = link[linkedTable.primaryDisplay]
        }
        newLinks.push(obj)
      }
      row[column] = newLinks
    }
  }
  return enriched
}
