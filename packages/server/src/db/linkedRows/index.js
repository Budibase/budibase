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
const CouchDB = require("../../db")
const { getMultiIDParams } = require("../../db/utils")

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
// re-export utils here for ease of use
exports.IncludeDocs = IncludeDocs
exports.getLinkDocuments = getLinkDocuments
exports.createLinkView = createLinkView

async function getLinksForRows(appId, rows) {
  const tableIds = [...new Set(rows.map(el => el.tableId))]
  // start by getting all the link values for performance reasons
  const responses = flatten(
    await Promise.all(
      tableIds.map(tableId =>
        getLinkDocuments({
          appId,
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
      // create a unique ID which we can use for getting only unique ones
      .map(el => ({ ...el, unique: el.id + el.fieldName })),
    "unique"
  )
}

/**
 * Update link documents for a row or table - this is to be called by the API controller when a change is occurring.
 * @param {string} eventType states what type of change which is occurring, means this can be expanded upon in the
 * future quite easily (all updates go through one function).
 * @param {string} appId The ID of the instance in which the change is occurring.
 * @param {string} tableId The ID of the of the table which is being changed.
 * @param {object|null} row The row which is changing, e.g. created, updated or deleted.
 * @param {object|null} table If the table has already been retrieved this can be used to reduce database gets.
 * @param {object|null} oldTable If the table is being updated then the old table can be provided for differencing.
 * @returns {Promise<object>} When the update is complete this will respond successfully. Returns the row for
 * row operations and the table for table operations.
 */
exports.updateLinks = async function({
  eventType,
  appId,
  row,
  tableId,
  table,
  oldTable,
}) {
  const baseReturnObj = row == null ? table : row
  if (appId == null) {
    throw "Cannot operate without an instance ID."
  }
  // make sure table ID is set
  if (tableId == null && table != null) {
    arguments[0].tableId = table._id
  }
  let linkController = new LinkController(arguments[0])
  try {
    if (
      !(await linkController.doesTableHaveLinkedFields()) &&
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
 * Update a row with information about the links that pertain to it.
 * @param {string} appId The instance in which this row has been created.
 * @param {object} rows The row(s) themselves which is to be updated with info (if applicable). This can be
 * a single row object or an array of rows - both will be handled.
 * @returns {Promise<object>} The updated row (this may be the same if no links were found). If an array was input
 * then an array will be output, object input -> object output.
 */
exports.attachLinkIDs = async (appId, rows) => {
  const links = await getLinksForRows(appId, rows)
  // now iterate through the rows and all field information
  for (let row of rows) {
    // find anything that matches the row's ID we are searching for and join it
    links
      .filter(el => el.thisId === row._id)
      .forEach(link => {
        if (row[link.fieldName] == null) {
          row[link.fieldName] = []
        }
        row[link.fieldName].push(link.id)
      })
  }
  // if it was an array when it came in then handle it as an array in response
  // otherwise return the first element as there was only one input
  return rows
}

/**
 * Given information about the table we can extract the display name from the linked rows, this
 * is what we do for showing the display name of each linked row when in a table format.
 * @param {string} appId The app in which the tables/rows/links exist.
 * @param {object} table The table from which the rows originated.
 * @param {array<object>} rows The rows which are to be enriched with the linked display names/IDs.
 * @returns {Promise<Array>} The enriched rows after having display names/IDs attached to the linked fields.
 */
exports.attachLinkedPrimaryDisplay = async (appId, table, rows) => {
  const linkedTableIds = getLinkedTableIDs(table)
  if (linkedTableIds.length === 0) {
    return rows
  }
  const db = new CouchDB(appId)
  const links = (await getLinksForRows(appId, rows)).filter(link =>
    rows.some(row => row._id === link.thisId)
  )
  const linkedRowIds = links.map(link => link.id)
  const linked = (await db.allDocs(getMultiIDParams(linkedRowIds))).rows.map(
    row => row.doc
  )
  // will populate this as we find them
  const linkedTables = []
  for (let row of rows) {
    for (let link of links.filter(link => link.thisId === row._id)) {
      if (row[link.fieldName] == null) {
        row[link.fieldName] = []
      }
      const linkedRow = linked.find(row => row._id === link.id)
      const linkedTableId =
        linkedRow.tableId || getRelatedTableForField(table, link.fieldName)
      const linkedTable = await getLinkedTable(db, linkedTableId, linkedTables)
      if (!linkedRow || !linkedTable) {
        continue
      }
      // need to handle an edge case where relationship just wasn't found
      const value = linkedRow[linkedTable.primaryDisplay] || linkedRow._id
      if (value) {
        row[link.fieldName].push(value)
      }
    }
  }
  return rows
}
