const linkRows = require("../../db/linkedRows")
const { cloneDeep } = require("lodash/fp")
const { FieldTypes, AutoFieldSubTypes } = require("../../constants")
const { attachmentsRelativeURL } = require("../index")
const { processFormulas } = require("./utils")

const BASE_AUTO_ID = 1

/**
 * A map of how we convert various properties in rows to each other based on the row type.
 */
const TYPE_TRANSFORM_MAP = {
  [FieldTypes.LINK]: {
    "": [],
    [null]: [],
    [undefined]: undefined,
    parse: link => {
      if (Array.isArray(link) && typeof link[0] === "object") {
        return link.map(el => (el && el._id ? el._id : el))
      }
      if (typeof link === "string") {
        return [link]
      }
      return link
    },
  },
  [FieldTypes.OPTIONS]: {
    "": null,
    [null]: null,
    [undefined]: undefined,
  },
  [FieldTypes.ARRAY]: {
    "": [],
    [null]: [],
    [undefined]: undefined,
  },
  [FieldTypes.STRING]: {
    "": "",
    [null]: "",
    [undefined]: undefined,
  },
  [FieldTypes.FORMULA]: {
    "": "",
    [null]: "",
    [undefined]: undefined,
  },
  [FieldTypes.LONGFORM]: {
    "": "",
    [null]: "",
    [undefined]: undefined,
  },
  [FieldTypes.NUMBER]: {
    "": null,
    [null]: null,
    [undefined]: undefined,
    parse: n => parseFloat(n),
  },
  [FieldTypes.DATETIME]: {
    "": null,
    [undefined]: undefined,
    [null]: null,
    parse: date => {
      if (date instanceof Date) {
        return date.toISOString()
      }
      return date
    },
  },
  [FieldTypes.ATTACHMENT]: {
    "": [],
    [null]: [],
    [undefined]: undefined,
  },
  [FieldTypes.BOOLEAN]: {
    "": null,
    [null]: null,
    [undefined]: undefined,
    true: true,
    false: false,
  },
  [FieldTypes.AUTO]: {
    parse: () => undefined,
  },
}

/**
 * This will update any auto columns that are found on the row/table with the correct information based on
 * time now and the current logged in user making the request.
 * @param {Object} user The user to be used for an appId as well as the createdBy and createdAt fields.
 * @param {Object} table The table which is to be used for the schema, as well as handling auto IDs incrementing.
 * @param {Object} row The row which is to be updated with information for the auto columns.
 * @param {Object} opts specific options for function to carry out optional features.
 * @returns {{row: Object, table: Object}} The updated row and table, the table may need to be updated
 * for automatic ID purposes.
 */
function processAutoColumn(
  user,
  table,
  row,
  opts = { reprocessing: false, noAutoRelationships: false }
) {
  let noUser = !user || !user.userId
  let now = new Date().toISOString()
  // if a row doesn't have a revision then it doesn't exist yet
  const creating = !row._rev
  for (let [key, schema] of Object.entries(table.schema)) {
    if (!schema.autocolumn) {
      continue
    }
    switch (schema.subtype) {
      case AutoFieldSubTypes.CREATED_BY:
        if (
          creating &&
          !opts.reprocessing &&
          !opts.noAutoRelationships &&
          !noUser
        ) {
          row[key] = [user.userId]
        }
        break
      case AutoFieldSubTypes.CREATED_AT:
        if (creating) {
          row[key] = now
        }
        break
      case AutoFieldSubTypes.UPDATED_BY:
        if (!opts.reprocessing && !opts.noAutoRelationships && !noUser) {
          row[key] = [user.userId]
        }
        break
      case AutoFieldSubTypes.UPDATED_AT:
        row[key] = now
        break
      case AutoFieldSubTypes.AUTO_ID:
        if (creating) {
          schema.lastID = !schema.lastID ? BASE_AUTO_ID : schema.lastID + 1
          row[key] = schema.lastID
        }
        break
    }
  }
  return { table, row }
}
exports.processAutoColumn = processAutoColumn

/**
 * This will coerce a value to the correct types based on the type transform map
 * @param {object} row The value to coerce
 * @param {object} type The type fo coerce to
 * @returns {object} The coerced value
 */
exports.coerce = (row, type) => {
  // no coercion specified for type, skip it
  if (!TYPE_TRANSFORM_MAP[type]) {
    return row
  }
  // eslint-disable-next-line no-prototype-builtins
  if (TYPE_TRANSFORM_MAP[type].hasOwnProperty(row)) {
    return TYPE_TRANSFORM_MAP[type][row]
  } else if (TYPE_TRANSFORM_MAP[type].parse) {
    return TYPE_TRANSFORM_MAP[type].parse(row)
  }

  return row
}

/**
 * Given an input route this function will apply all the necessary pre-processing to it, such as coercion
 * of column values or adding auto-column values.
 * @param {object} user the user which is performing the input.
 * @param {object} row the row which is being created/updated.
 * @param {object} table the table which the row is being saved to.
 * @param {object} opts some input processing options (like disabling auto-column relationships).
 * @returns {object} the row which has been prepared to be written to the DB.
 */
exports.inputProcessing = (
  user = {},
  table,
  row,
  opts = { noAutoRelationships: false }
) => {
  let clonedRow = cloneDeep(row)
  // need to copy the table so it can be differenced on way out
  const copiedTable = cloneDeep(table)
  const dontCleanseKeys = ["type", "_id", "_rev", "tableId"]
  for (let [key, value] of Object.entries(clonedRow)) {
    const field = table.schema[key]
    // cleanse fields that aren't in the schema
    if (!field) {
      if (dontCleanseKeys.indexOf(key) === -1) {
        delete clonedRow[key]
      }
      continue
    }
    // specific case to delete formula values if they get saved
    // type coercion cannot completely remove the field, so have to do it here
    if (field.type === FieldTypes.FORMULA) {
      delete clonedRow[key]
    } else {
      clonedRow[key] = exports.coerce(value, field.type)
    }
  }

  if (!clonedRow._id || !clonedRow._rev) {
    clonedRow._id = row._id
    clonedRow._rev = row._rev
  }

  // handle auto columns - this returns an object like {table, row}
  return processAutoColumn(user, copiedTable, clonedRow, opts)
}

/**
 * This function enriches the input rows with anything they are supposed to contain, for example
 * link records or attachment links.
 * @param {object} ctx the request which is looking for enriched rows.
 * @param {object} table the table from which these rows came from originally, this is used to determine
 * the schema of the rows and then enrich.
 * @param {object[]|object} rows the rows which are to be enriched.
 * @param {object} opts used to set some options for the output, such as disabling relationship squashing.
 * @returns {object[]|object} the enriched rows will be returned.
 */
exports.outputProcessing = async (
  ctx,
  table,
  rows,
  opts = { squash: true }
) => {
  const appId = ctx.appId
  let wasArray = true
  if (!(rows instanceof Array)) {
    rows = [rows]
    wasArray = false
  }
  // attach any linked row information
  let enriched = await linkRows.attachFullLinkedDocs(ctx, table, rows)

  // process formulas
  enriched = processFormulas(table, enriched)

  // update the attachments URL depending on hosting
  for (let [property, column] of Object.entries(table.schema)) {
    if (column.type === FieldTypes.ATTACHMENT) {
      for (let row of enriched) {
        if (row[property] == null || row[property].length === 0) {
          continue
        }
        row[property].forEach(attachment => {
          attachment.url = attachmentsRelativeURL(attachment.key)
        })
      }
    }
  }
  if (opts.squash) {
    enriched = await linkRows.squashLinksToPrimaryDisplay(
      appId,
      table,
      enriched
    )
  }
  return wasArray ? enriched : enriched[0]
}
