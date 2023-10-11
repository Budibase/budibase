import * as linkRows from "../../db/linkedRows"
import { FieldTypes, AutoFieldSubTypes } from "../../constants"
import { processFormulas, fixAutoColumnSubType } from "./utils"
import { ObjectStoreBuckets } from "../../constants"
import { context, db as dbCore, objectStore } from "@budibase/backend-core"
import { InternalTables } from "../../db/utils"
import { TYPE_TRANSFORM_MAP } from "./map"
import {
  AutoColumnFieldMetadata,
  FieldSubtype,
  Row,
  RowAttachment,
  Table,
} from "@budibase/types"
import { cloneDeep } from "lodash/fp"
import {
  processInputBBReferences,
  processOutputBBReferences,
} from "./bbReferenceProcessor"
import { isExternalTable } from "../../integrations/utils"
export * from "./utils"

type AutoColumnProcessingOpts = {
  reprocessing?: boolean
  noAutoRelationships?: boolean
}

const BASE_AUTO_ID = 1

/**
 * Given the old state of the row and the new one after an update, this will
 * find the keys that have been removed in the updated row.
 */
function getRemovedAttachmentKeys(
  oldRow: Row,
  row: Row,
  attachmentKey: string
) {
  if (!oldRow[attachmentKey]) {
    return []
  }
  const oldKeys = oldRow[attachmentKey].map((attachment: any) => attachment.key)
  // no attachments in new row, all removed
  if (!row[attachmentKey]) {
    return oldKeys
  }
  const newKeys = row[attachmentKey].map((attachment: any) => attachment.key)
  return oldKeys.filter((key: string) => newKeys.indexOf(key) === -1)
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
export function processAutoColumn(
  userId: string | null | undefined,
  table: Table,
  row: Row,
  opts?: AutoColumnProcessingOpts
) {
  let noUser = !userId
  let isUserTable = table._id === InternalTables.USER_METADATA
  let now = new Date().toISOString()
  // if a row doesn't have a revision then it doesn't exist yet
  const creating = !row._rev
  // check its not user table, or whether any of the processing options have been disabled
  const shouldUpdateUserFields =
    !isUserTable && !opts?.reprocessing && !opts?.noAutoRelationships && !noUser
  for (let [key, schema] of Object.entries(table.schema)) {
    if (!schema.autocolumn) {
      continue
    }
    if (!schema.subtype) {
      schema = fixAutoColumnSubType(schema)
    }
    switch (schema.subtype) {
      case AutoFieldSubTypes.CREATED_BY:
        if (creating && shouldUpdateUserFields && userId) {
          row[key] = [userId]
        }
        break
      case AutoFieldSubTypes.CREATED_AT:
        if (creating) {
          row[key] = now
        }
        break
      case AutoFieldSubTypes.UPDATED_BY:
        if (shouldUpdateUserFields && userId) {
          row[key] = [userId]
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

/**
 * This will coerce a value to the correct types based on the type transform map
 * @param {object} row The value to coerce
 * @param {object} type The type fo coerce to
 * @returns {object} The coerced value
 */
export function coerce(row: any, type: string) {
  // no coercion specified for type, skip it
  if (!TYPE_TRANSFORM_MAP[type]) {
    return row
  }
  // eslint-disable-next-line no-prototype-builtins
  if (TYPE_TRANSFORM_MAP[type].hasOwnProperty(row)) {
    // @ts-ignore
    return TYPE_TRANSFORM_MAP[type][row]
  } else if (TYPE_TRANSFORM_MAP[type].parse) {
    // @ts-ignore
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
export async function inputProcessing(
  userId: string | null | undefined,
  table: Table,
  row: Row,
  opts?: AutoColumnProcessingOpts
) {
  let clonedRow = cloneDeep(row)

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
    // remove any formula values, they are to be generated
    if (field.type === FieldTypes.FORMULA) {
      delete clonedRow[key]
    }
    // otherwise coerce what is there to correct types
    else {
      clonedRow[key] = coerce(value, field.type)
    }

    // remove any attachment urls, they are generated on read
    if (field.type === FieldTypes.ATTACHMENT) {
      const attachments = clonedRow[key]
      if (attachments?.length) {
        attachments.forEach((attachment: RowAttachment) => {
          delete attachment.url
        })
      }
    }

    if (field.type === FieldTypes.BB_REFERENCE && value) {
      clonedRow[key] = await processInputBBReferences(
        value,
        field.subtype as FieldSubtype
      )
    }
  }

  if (!clonedRow._id || !clonedRow._rev) {
    clonedRow._id = row._id
    clonedRow._rev = row._rev
  }

  // handle auto columns - this returns an object like {table, row}
  return processAutoColumn(userId, table, clonedRow, opts)
}

/**
 * This function enriches the input rows with anything they are supposed to contain, for example
 * link records or attachment links.
 * @param {object} table the table from which these rows came from originally, this is used to determine
 * the schema of the rows and then enrich.
 * @param {object[]|object} rows the rows which are to be enriched.
 * @param {object} opts used to set some options for the output, such as disabling relationship squashing.
 * @returns {object[]|object} the enriched rows will be returned.
 */
export async function outputProcessing<T extends Row[] | Row>(
  table: Table,
  rows: T,
  opts: {
    squash?: boolean
    preserveLinks?: boolean
    skipBBReferences?: boolean
  } = {
    squash: true,
    preserveLinks: false,
    skipBBReferences: false,
  }
): Promise<T> {
  let safeRows: Row[]
  let wasArray = true
  if (!(rows instanceof Array)) {
    safeRows = [rows]
    wasArray = false
  } else {
    safeRows = rows
  }
  // attach any linked row information
  let enriched = !opts.preserveLinks
    ? await linkRows.attachFullLinkedDocs(table, safeRows)
    : safeRows

  // process complex types: attachements, bb references...
  for (let [property, column] of Object.entries(table.schema)) {
    if (column.type === FieldTypes.ATTACHMENT) {
      for (let row of enriched) {
        if (row[property] == null || !Array.isArray(row[property])) {
          continue
        }
        row[property].forEach((attachment: RowAttachment) => {
          attachment.url = objectStore.getAppFileUrl(attachment.key)
        })
      }
    } else if (
      !opts.skipBBReferences &&
      column.type == FieldTypes.BB_REFERENCE
    ) {
      for (let row of enriched) {
        row[property] = await processOutputBBReferences(
          row[property],
          column.subtype as FieldSubtype
        )
      }
    }
  }

  // process formulas after the complex types had been processed
  enriched = processFormulas(table, enriched, { dynamic: true }) as Row[]

  if (opts.squash) {
    enriched = (await linkRows.squashLinksToPrimaryDisplay(
      table,
      enriched
    )) as Row[]
  }
  // remove null properties to match internal API
  if (isExternalTable(table._id!)) {
    for (let row of enriched) {
      for (let key of Object.keys(row)) {
        if (row[key] === null) {
          delete row[key]
        }
      }
    }
  }
  return (wasArray ? enriched : enriched[0]) as T
}

/**
 * Clean up any attachments that were attached to a row.
 * @param {object} table The table from which a row is being removed.
 * @param {any} row optional - the row being removed.
 * @param {any} rows optional - if multiple rows being deleted can do this in bulk.
 * @param {any} oldRow optional - if updating a row this will determine the difference.
 * @param {any} oldTable optional - if updating a table, can supply the old table to look for
 * deleted attachment columns.
 * @return {Promise<void>} When all attachments have been removed this will return.
 */
export async function cleanupAttachments(
  table: Table,
  {
    row,
    rows,
    oldRow,
    oldTable,
  }: { row?: Row; rows?: Row[]; oldRow?: Row; oldTable?: Table }
): Promise<any> {
  const appId = context.getAppId()
  if (!dbCore.isProdAppID(appId)) {
    const prodAppId = dbCore.getProdAppID(appId!)
    // if prod exists, then don't allow deleting
    const exists = await dbCore.dbExists(prodAppId)
    if (exists) {
      return
    }
  }
  let files: string[] = []
  function addFiles(row: Row, key: string) {
    if (row[key]) {
      files = files.concat(row[key].map((attachment: any) => attachment.key))
    }
  }
  const schemaToUse = oldTable ? oldTable.schema : table.schema
  for (let [key, schema] of Object.entries(schemaToUse)) {
    if (schema.type !== FieldTypes.ATTACHMENT) {
      continue
    }
    // old table had this column, new table doesn't - delete it
    if (rows && oldTable && !table.schema[key]) {
      rows.forEach(row => addFiles(row, key))
    } else if (oldRow && row) {
      // if updating, need to manage the differences
      files = files.concat(getRemovedAttachmentKeys(oldRow, row, key))
    } else if (row) {
      addFiles(row, key)
    } else if (rows) {
      rows.forEach(row => addFiles(row, key))
    }
  }
  if (files.length > 0) {
    await objectStore.deleteFiles(ObjectStoreBuckets.APPS, files)
  }
}
