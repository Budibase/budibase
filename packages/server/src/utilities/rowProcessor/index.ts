import * as linkRows from "../../db/linkedRows"
import { fixAutoColumnSubType, processFormulas } from "./utils"
import {
  cache,
  context,
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
  ViewV2,
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
  isExternalColumnName,
  isInternalColumnName,
  PROTECTED_EXTERNAL_COLUMNS,
  PROTECTED_INTERNAL_COLUMNS,
} from "@budibase/shared-core"
import { processStringSync } from "@budibase/string-templates"
import {
  getTableFromSource,
  isUserMetadataTable,
} from "../../api/controllers/row/utils"
import sdk from "../../sdk"

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
  let tableMutated = false
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
          tableMutated = true
        }
        break
    }
  }

  if (tableMutated) {
    const db = context.getAppDB()
    const resp = await db.put(table)
    table._rev = resp.rev
  }
}

async function processDefaultValues(table: Table, row: Row) {
  const ctx: { ["Current User"]?: User; user?: User } = {}

  const identity = context.getIdentity()
  if (identity?._id && identity.type === IdentityType.USER) {
    const user = await cache.user.getUser({
      userId: identity._id,
    })
    delete user.password

    ctx["Current User"] = user
    ctx.user = user
  }

  for (const [key, schema] of Object.entries(table.schema)) {
    const isEmpty =
      row[key] == null ||
      row[key] === "" ||
      (Array.isArray(row[key]) && row[key].length === 0)

    if ("default" in schema && schema.default != null && isEmpty) {
      let processed: string | string[]
      if (Array.isArray(schema.default)) {
        processed = schema.default.map(val => processStringSync(val, ctx))
      } else if (typeof schema.default === "string") {
        processed = processStringSync(schema.default, ctx)
      } else {
        processed = schema.default
      }

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
 * @param value The value to coerce
 * @param type The type fo coerce to
 * @returns The coerced value
 */
export function coerce(value: unknown, type: string) {
  // no coercion specified for type, skip it
  if (!TYPE_TRANSFORM_MAP[type]) {
    return value
  }
  // eslint-disable-next-line no-prototype-builtins
  if (TYPE_TRANSFORM_MAP[type].hasOwnProperty(value)) {
    // @ts-ignore
    return TYPE_TRANSFORM_MAP[type][value]
  } else if (TYPE_TRANSFORM_MAP[type].parse) {
    // @ts-ignore
    return TYPE_TRANSFORM_MAP[type].parse(value)
  }

  return value
}

/**
 * Given an input route this function will apply all the necessary pre-processing to it, such as coercion
 * of column values or adding auto-column values.
 * @param userId the ID of the user which is performing the input.
 * @param row the row which is being created/updated.
 * @param source the table/view which the row is being saved to.
 * @param opts some input processing options (like disabling auto-column relationships).
 * @returns the row which has been prepared to be written to the DB.
 */
export async function inputProcessing(
  userId: string | null | undefined,
  source: Table | ViewV2,
  row: Row,
  opts?: AutoColumnProcessingOpts
) {
  const clonedRow = cloneDeep(row)
  const table = await getTableFromSource(source)

  for (const [key, value] of Object.entries(clonedRow)) {
    const field = table.schema[key]
    const isBuiltinColumn = isExternalTableID(table._id!)
      ? isExternalColumnName(key)
      : isInternalColumnName(key)
    // cleanse fields that aren't in the schema
    if (!field && !isBuiltinColumn) {
      delete clonedRow[key]
    }
    // field isn't found - might be a built-in column, skip over it
    if (!field) {
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
  return clonedRow
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
  source: Table | ViewV2,
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

  let table: Table
  if (sdk.views.isView(source)) {
    table = await sdk.views.getTable(source.id)
  } else {
    table = source
  }

  // SQS returns the rows with full relationship contents
  // attach any linked row information
  let enriched = !opts.preserveLinks
    ? await linkRows.attachFullLinkedDocs(table.schema, safeRows, {
        fromRow: opts?.fromRow,
      })
    : safeRows

  if (!opts.squash && utils.hasCircularStructure(rows)) {
    opts.squash = true
  }

  enriched = await coreOutputProcessing(source, enriched, opts)

  if (opts.squash) {
    enriched = await linkRows.squashLinks(source, enriched)
  }

  return (wasArray ? enriched : enriched[0]) as T
}

/**
 * This function is similar to the outputProcessing function above, it makes
 * sure that all the provided rows are ready for output, but does not have
 * enrichment for squash capabilities which can cause performance issues.
 * outputProcessing should be used when responding from the API, while this
 * should be used when internally processing rows for any reason (like part of
 * view operations).
 */
export async function coreOutputProcessing(
  source: Table | ViewV2,
  rows: Row[],
  opts: {
    preserveLinks?: boolean
    skipBBReferences?: boolean
    fromViewId?: string
  } = {
    preserveLinks: false,
    skipBBReferences: false,
  }
): Promise<Row[]> {
  let table: Table
  if (sdk.views.isView(source)) {
    table = await sdk.views.getTable(source.id)
  } else {
    table = source
  }

  // process complex types: attachments, bb references...
  for (const [property, column] of Object.entries(table.schema)) {
    if (
      column.type === FieldType.ATTACHMENTS ||
      column.type === FieldType.ATTACHMENT_SINGLE ||
      column.type === FieldType.SIGNATURE_SINGLE
    ) {
      for (const row of rows) {
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
      for (const row of rows) {
        row[property] = await processOutputBBReferences(
          row[property],
          column.subtype
        )
      }
    } else if (
      !opts.skipBBReferences &&
      column.type == FieldType.BB_REFERENCE_SINGLE
    ) {
      for (const row of rows) {
        row[property] = await processOutputBBReference(
          row[property],
          column.subtype
        )
      }
    } else if (column.type === FieldType.DATETIME && column.timeOnly) {
      for (const row of rows) {
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
    } else if (column.type === FieldType.DATETIME && column.dateOnly) {
      for (const row of rows) {
        if (typeof row[property] === "string") {
          row[property] = new Date(row[property])
        }
        if (row[property] instanceof Date) {
          row[property] = row[property].toISOString().slice(0, 10)
        }
      }
    } else if (column.type === FieldType.LINK) {
      for (let row of rows) {
        // if relationship is empty - remove the array, this has been part of the API for some time
        if (Array.isArray(row[property]) && row[property].length === 0) {
          delete row[property]
        }
      }
    }
  }

  // process formulas after the complex types had been processed
  rows = await processFormulas(table, rows, { dynamic: true })

  // remove null properties to match internal API
  const isExternal = isExternalTableID(table._id!)
  for (const row of rows) {
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

  if (sdk.views.isView(source)) {
    // We ensure calculation fields are returned as numbers.  During the
    // testing of this feature it was discovered that the COUNT operation
    // returns a string for MySQL, MariaDB, and Postgres. But given that all
    // calculation fields (except ones operating on BIGINTs) should be
    // numbers, we blanket make sure of that here.
    for (const [name, field] of Object.entries(
      helpers.views.calculationFields(source)
    )) {
      if ("field" in field) {
        const targetSchema = table.schema[field.field]
        // We don't convert BIGINT fields to floats because we could lose
        // precision.
        if (targetSchema.type === FieldType.BIGINT) {
          continue
        }
      }

      for (const row of rows) {
        if (typeof row[name] === "string") {
          row[name] = parseFloat(row[name])
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

    if (sdk.views.isView(source)) {
      const aggregations = helpers.views.calculationFields(source)
      for (const key of Object.keys(aggregations)) {
        fields.push(key.toLowerCase())
      }
    }

    for (const row of rows) {
      for (const key of Object.keys(row)) {
        if (!fields.includes(key.toLowerCase())) {
          delete row[key]
        }
      }
    }
  }

  return rows
}
