const env = require("../environment")
const { OBJ_STORE_DIRECTORY } = require("../constants")
const linkRows = require("../db/linkedRows")
const { cloneDeep } = require("lodash/fp")
const { FieldTypes, AutoFieldSubTypes } = require("../constants")

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
    [null]: "",
    [undefined]: undefined,
  },
  [FieldTypes.STRING]: {
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
 * @returns {{row: Object, table: Object}} The updated row and table, the table may need to be updated
 * for automatic ID purposes.
 */
function processAutoColumn(user, table, row) {
  let now = new Date().toISOString()
  // if a row doesn't have a revision then it doesn't exist yet
  const creating = !row._rev
  for (let [key, schema] of Object.entries(table.schema)) {
    if (!schema.autocolumn) {
      continue
    }
    switch (schema.subtype) {
      case AutoFieldSubTypes.CREATED_BY:
        if (creating) {
          row[key] = [user.userId]
        }
        break
      case AutoFieldSubTypes.CREATED_AT:
        if (creating) {
          row[key] = now
        }
        break
      case AutoFieldSubTypes.UPDATED_BY:
        row[key] = [user.userId]
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

/**
 * This will coerce a value to the correct types based on the type transform map
 * @param {object} row The value to coerce
 * @param {object} type The type fo coerce to
 * @returns {object} The coerced value
 */
exports.coerce = (row, type) => {
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
 * @returns {object} the row which has been prepared to be written to the DB.
 */
exports.inputProcessing = (user, table, row) => {
  let clonedRow = cloneDeep(row)
  // need to copy the table so it can be differenced on way out
  const copiedTable = cloneDeep(table)
  for (let [key, value] of Object.entries(clonedRow)) {
    const field = table.schema[key]
    if (!field) {
      continue
    }
    clonedRow[key] = exports.coerce(value, field.type)
  }
  // handle auto columns - this returns an object like {table, row}
  return processAutoColumn(user, copiedTable, clonedRow)
}

/**
 * This function enriches the input rows with anything they are supposed to contain, for example
 * link records or attachment links.
 * @param {string} appId the ID of the application for which rows are being enriched.
 * @param {object} table the table from which these rows came from originally, this is used to determine
 * the schema of the rows and then enrich.
 * @param {object[]} rows the rows which are to be enriched.
 * @returns {object[]} the enriched rows will be returned.
 */
exports.outputProcessing = async (appId, table, rows) => {
  let wasArray = true
  if (!(rows instanceof Array)) {
    rows = [rows]
    wasArray = false
  }
  // attach any linked row information
  const outputRows = await linkRows.attachLinkedPrimaryDisplay(
    appId,
    table,
    rows
  )
  // update the attachments URL depending on hosting
  if (env.CLOUD && env.SELF_HOSTED) {
    for (let [property, column] of Object.entries(table.schema)) {
      if (column.type === FieldTypes.ATTACHMENT) {
        for (let row of outputRows) {
          if (row[property] == null || row[property].length === 0) {
            continue
          }
          row[property].forEach(attachment => {
            attachment.url = `${OBJ_STORE_DIRECTORY}/${appId}/${attachment.url}`
            attachment.url = attachment.url.replace("//", "/")
          })
        }
      }
    }
  }
  return wasArray ? outputRows : outputRows[0]
}
