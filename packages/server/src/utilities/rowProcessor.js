const env = require("../environment")
const { OBJ_STORE_DIRECTORY } = require("../constants")
const linkRows = require("../db/linkedRows")
const { cloneDeep } = require("lodash/fp")

/**
 * A map of how we convert various properties in rows to each other based on the row type.
 */
const TYPE_TRANSFORM_MAP = {
  link: {
    "": [],
    [null]: [],
    [undefined]: undefined,
  },
  options: {
    "": "",
    [null]: "",
    [undefined]: undefined,
  },
  string: {
    "": "",
    [null]: "",
    [undefined]: undefined,
  },
  longform: {
    "": "",
    [null]: "",
    [undefined]: undefined,
  },
  number: {
    "": null,
    [null]: null,
    [undefined]: undefined,
    parse: n => parseFloat(n),
  },
  datetime: {
    "": null,
    [undefined]: undefined,
    [null]: null,
  },
  attachment: {
    "": [],
    [null]: [],
    [undefined]: undefined,
  },
  boolean: {
    "": null,
    [null]: null,
    [undefined]: undefined,
    true: true,
    false: false,
  },
}

/**
 * This will coerce a value to the correct types based on the type transform map
 * @param {any} value The value to coerce
 * @param {string} type The type fo coerce to
 * @returns {any} The coerced value
 */
exports.coerce = (value, type) => {
  // eslint-disable-next-line no-prototype-builtins
  if (TYPE_TRANSFORM_MAP[type].hasOwnProperty(value)) {
    return TYPE_TRANSFORM_MAP[type][value]
  } else if (TYPE_TRANSFORM_MAP[type].parse) {
    return TYPE_TRANSFORM_MAP[type].parse(value)
  }
  return value
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
  const clonedRow = cloneDeep(row)
  for (let [key, value] of Object.entries(clonedRow)) {
    const field = table.schema[key]
    if (!field) continue

    clonedRow[key] = exports.coerce(value, field.type)
  }
  return clonedRow
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
  // attach any linked row information
  const outputRows = await linkRows.attachLinkInfo(appId, rows)
  // update the attachments URL depending on hosting
  if (env.CLOUD && env.SELF_HOSTED) {
    for (let [property, column] of Object.entries(table.schema)) {
      if (column.type === "attachment") {
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
  return outputRows
}
