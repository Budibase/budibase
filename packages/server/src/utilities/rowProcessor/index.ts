import * as linkRows from "../../db/linkedRows"
import { fixAutoColumnSubType, processFormulas } from "./utils"
import {
  cache,
  context,
  features,
  HTTPError,
  objectStore,
  utils,
} from "@budibase/backend-core"
import { InternalTables } from "../../db/utils"
import { TYPE_TRANSFORM_MAP } from "./map"
import {
  AutoFieldSubType,
  FieldType,
  IdentityType,
  Row,
  RowAttachment,
  Table,
  User,
} from "@budibase/types"
import { cloneDeep } from "lodash/fp"
import {
  processInputBBReference,
  processInputBBReferences,
  processOutputBBReference,
  processOutputBBReferences,
} from "./bbReferenceProcessor"
import { isExternalTableID } from "../../integrations/utils"
import {
  helpers,
  PROTECTED_EXTERNAL_COLUMNS,
  PROTECTED_INTERNAL_COLUMNS,
} from "@budibase/shared-core"
import { processString } from "@budibase/string-templates"
import { isUserMetadataTable } from "../../api/controllers/row/utils"

export * from "./utils"
export * from "./attachments"

type AutoColumnProcessingOpts = {
  reprocessing?: boolean
  noAutoRelationships?: boolean
}

/**
 * This will update any auto columns that are found on the row/table with the correct information based on
 * time now and the current logged in user making the request.
 * @param userId The user to be used for an appId as well as the createdBy and createdAt fields.
 * @param table The table which is to be used for the schema, as well as handling auto IDs incrementing.
 * @param row The row which is to be updated with information for the auto columns.
 * @param opts specific options for function to carry out optional features.
 * @returns The updated row and table, the table may need to be updated
 * for automatic ID purposes.
 */
export async function processAutoColumn(
  userId: string | null | undefined,
  table: Table,
  row: Row,
  opts?: AutoColumnProcessingOpts
) {
  const noUser = !userId
  const isUserTable = table._id === InternalTables.USER_METADATA
  const now = new Date().toISOString()
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
      case AutoFieldSubType.CREATED_BY:
        if (creating && shouldUpdateUserFields && userId) {
          row[key] = [userId]
        }
        break
      case AutoFieldSubType.CREATED_AT:
        if (creating) {
          row[key] = now
        }
        break
      case AutoFieldSubType.UPDATED_BY:
        if (shouldUpdateUserFields && userId) {
          row[key] = [userId]
        }
        break
      case AutoFieldSubType.UPDATED_AT:
        row[key] = now
        break
      case AutoFieldSubType.AUTO_ID:
        if (creating) {
          schema.lastID = schema.lastID || 0
          row[key] = schema.lastID + 1
          schema.lastID++
          table.schema[key] = schema
        }
        break
    }
  }
}

async function processDefaultValues(table: Table, row: Row) {
  const ctx: { ["Current User"]?: User; user?: User } = {}

  const identity = context.getIdentity()
  if (identity?._id && identity.type === IdentityType.USER) {
    const user = await cache.user.getUser(identity._id)
    delete user.password

    ctx["Current User"] = user
    ctx.user = user
  }

  for (const [key, schema] of Object.entries(table.schema)) {
    if ("default" in schema && schema.default != null && row[key] == null) {
      const processed = await processString(schema.default, ctx)

      try {
        row[key] = coerce(processed, schema.type)
      } catch (err: any) {
        throw new HTTPError(
          `Invalid default value for field '${key}' - ${err.message}`,
          400
        )
      }
    }
  }
}

/**
 * This will coerce a value to the correct types based on the type transform map
 * @param row The value to coerce
 * @param type The type fo coerce to
 * @returns The coerced value
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
 * @param user the user which is performing the input.
 * @param row the row which is being created/updated.
 * @param table the table which the row is being saved to.
 * @param opts some input processing options (like disabling auto-column relationships).
 * @returns the row which has been prepared to be written to the DB.
 */
export async function inputProcessing(
  userId: string | null | undefined,
  table: Table,
  row: Row,
  opts?: AutoColumnProcessingOpts
) {
  const clonedRow = cloneDeep(row)

  const dontCleanseKeys = ["type", "_id", "_rev", "tableId"]
  for (const [key, value] of Object.entries(clonedRow)) {
    const field = table.schema[key]
    // cleanse fields that aren't in the schema
    if (!field) {
      if (dontCleanseKeys.indexOf(key) === -1) {
        delete clonedRow[key]
      }
      continue
    }
    // remove any formula values, they are to be generated
    if (field.type === FieldType.FORMULA) {
      delete clonedRow[key]
    }
    // otherwise coerce what is there to correct types
    else {
      clonedRow[key] = coerce(value, field.type)
    }

    // remove any attachment urls, they are generated on read
    if (field.type === FieldType.ATTACHMENTS) {
      const attachments = clonedRow[key]
      if (attachments?.length) {
        attachments.forEach((attachment: RowAttachment) => {
          delete attachment.url
        })
      }
    } else if (
      field.type === FieldType.ATTACHMENT_SINGLE ||
      field.type === FieldType.SIGNATURE_SINGLE
    ) {
      const attachment = clonedRow[key]
      if (attachment?.url) {
        delete clonedRow[key].url
      }
    } else if (
      value &&
      (field.type === FieldType.BB_REFERENCE_SINGLE ||
        helpers.schema.isDeprecatedSingleUserColumn(field))
    ) {
      clonedRow[key] = await processInputBBReference(value, field.subtype)
    } else if (value && field.type === FieldType.BB_REFERENCE) {
      clonedRow[key] = await processInputBBReferences(value, field.subtype)
    }
  }

  if (!clonedRow._id || !clonedRow._rev) {
    clonedRow._id = row._id
    clonedRow._rev = row._rev
  }

  await processAutoColumn(userId, table, clonedRow, opts)
  await processDefaultValues(table, clonedRow)

  return { table, row: clonedRow }
}

/**
 * This function enriches the input rows with anything they are supposed to contain, for example
 * link records or attachment links.
 * @param table the table from which these rows came from originally, this is used to determine
 * the schema of the rows and then enrich.
 * @param rows the rows which are to be enriched.
 * @param opts used to set some options for the output, such as disabling relationship squashing.
 * @returns the enriched rows will be returned.
 */
export async function outputProcessing<T extends Row[] | Row>(
  table: Table,
  rows: T,
  opts: {
    squash?: boolean
    preserveLinks?: boolean
    fromRow?: Row
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
    ? await linkRows.attachFullLinkedDocs(table.schema, safeRows, {
        fromRow: opts?.fromRow,
      })
    : safeRows

  // make sure squash is enabled if needed
  if (!opts.squash && utils.hasCircularStructure(rows)) {
    opts.squash = true
  }

  // process complex types: attachments, bb references...
  for (const [property, column] of Object.entries(table.schema)) {
    if (
      column.type === FieldType.ATTACHMENTS ||
      column.type === FieldType.ATTACHMENT_SINGLE ||
      column.type === FieldType.SIGNATURE_SINGLE
    ) {
      for (const row of enriched) {
        if (row[property] == null) {
          continue
        }
        const process = (attachment: RowAttachment) => {
          if (!attachment.url && attachment.key) {
            attachment.url = objectStore.getAppFileUrl(attachment.key)
          }
          return attachment
        }
        if (typeof row[property] === "string" && row[property].length) {
          row[property] = JSON.parse(row[property])
        }
        if (Array.isArray(row[property])) {
          row[property].forEach((attachment: RowAttachment) => {
            process(attachment)
          })
        } else {
          process(row[property])
        }
      }
    } else if (
      !opts.skipBBReferences &&
      column.type == FieldType.BB_REFERENCE
    ) {
      for (const row of enriched) {
        row[property] = await processOutputBBReferences(
          row[property],
          column.subtype
        )
      }
    } else if (
      !opts.skipBBReferences &&
      column.type == FieldType.BB_REFERENCE_SINGLE
    ) {
      for (const row of enriched) {
        row[property] = await processOutputBBReference(
          row[property],
          column.subtype
        )
      }
    } else if (column.type === FieldType.DATETIME && column.timeOnly) {
      for (const row of enriched) {
        if (row[property] instanceof Date) {
          const hours = row[property].getUTCHours().toString().padStart(2, "0")
          const minutes = row[property]
            .getUTCMinutes()
            .toString()
            .padStart(2, "0")
          const seconds = row[property]
            .getUTCSeconds()
            .toString()
            .padStart(2, "0")
          row[property] = `${hours}:${minutes}:${seconds}`
        }
      }
    }
  }

  // process formulas after the complex types had been processed
  enriched = await processFormulas(table, enriched, { dynamic: true })

  if (opts.squash) {
    enriched = (await linkRows.squashLinksToPrimaryDisplay(
      table,
      enriched
    )) as Row[]
  }
  // remove null properties to match internal API
  const isExternal = isExternalTableID(table._id!)
  if (isExternal || (await features.flags.isEnabled("SQS"))) {
    for (const row of enriched) {
      for (const key of Object.keys(row)) {
        if (row[key] === null) {
          delete row[key]
        } else if (row[key] && table.schema[key]?.type === FieldType.LINK) {
          for (const link of row[key] || []) {
            for (const linkKey of Object.keys(link)) {
              if (link[linkKey] === null) {
                delete link[linkKey]
              }
            }
          }
        }
      }
    }
  }

  if (!isUserMetadataTable(table._id!)) {
    const protectedColumns = isExternal
      ? PROTECTED_EXTERNAL_COLUMNS
      : PROTECTED_INTERNAL_COLUMNS

    const tableFields = Object.keys(table.schema).filter(
      f => table.schema[f].visible !== false
    )
    const fields = [...tableFields, ...protectedColumns].map(f =>
      f.toLowerCase()
    )
    for (const row of enriched) {
      for (const key of Object.keys(row)) {
        if (!fields.includes(key.toLowerCase())) {
          delete row[key]
        }
      }
    }
  }

  return (wasArray ? enriched : enriched[0]) as T
}
