import { chunk } from "lodash"
import { context, events } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import {
  DocumentType,
  FieldType,
  QuotaUsageType,
  SEPARATOR,
  StaticQuotaName,
} from "@budibase/types"
import type { Database, Document, Row, Table } from "@budibase/types"
import { getRowParams } from "../../../db/utils"

const ROW_PAGE_SIZE = 1000
const ROW_CHUNK_SIZE = 500
const ROW_WRITE_ATTEMPTS = 3
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const stripIgnoreTimezoneSuffix = ({
  rows,
  table,
}: {
  rows: Row[]
  table: Table
}): Row[] => {
  const columns = Object.entries(table.schema)
    .filter(
      ([_, schema]) =>
        schema.type === FieldType.DATETIME &&
        schema.ignoreTimezones &&
        !schema.timeOnly
    )
    .map(([name]) => name)
  return rows.map(row => {
    const result = { ...row }
    for (const column of columns) {
      const value = result[column]
      if (typeof value === "string" && value.endsWith("Z")) {
        result[column] = value.slice(0, -1)
      }
    }
    return result
  })
}

const findMissingRows = async ({
  db,
  rows,
}: {
  db: Database
  rows: Row[]
}): Promise<Row[]> => {
  const existing = await db.getMultiple<Row>(
    rows.map(row => row._id!),
    { allowMissing: true }
  )
  const existingIds = new Set(existing.map(row => row._id))
  return rows.filter(row => !existingIds.has(row._id!))
}

const writeRows = async ({
  db,
  rows,
  table,
}: {
  db: Database
  rows: Row[]
  table: Table
}) => {
  const tableId = table._id!
  await quotas.updateUsage({
    usageChange: rows.length,
    name: StaticQuotaName.ROWS,
    type: QuotaUsageType.STATIC,
    opts: { dryRun: true, id: tableId },
  })

  let pending = rows
  let confirmed = 0
  let writeFailed = false
  let failure: unknown = new Error("Failed to seed production rows")
  try {
    for (let attempt = 1; attempt <= ROW_WRITE_ATTEMPTS; attempt++) {
      try {
        const response = await db.bulkDocs(pending)
        const writtenIds = new Set(
          response.filter(result => !result.error).map(result => result.id)
        )
        const unresolved = pending.filter(row => !writtenIds.has(row._id!))
        confirmed += pending.length - unresolved.length
        pending = unresolved
        if (pending.length) {
          const error = response.find(result => result.error)
          failure = new Error(
            error?.reason || error?.error || "Incomplete seed bulk response"
          )
        }
      } catch (error) {
        failure = error
      }

      if (!pending.length) {
        break
      }

      // A failed request can still commit rows. Keep their IDs and retry only
      // documents confirmed missing, without overwriting production changes.
      try {
        const missing = await findMissingRows({ db, rows: pending })
        confirmed += pending.length - missing.length
        pending = missing
      } catch (error) {
        console.error(
          `Failed to verify seeded rows for table ${tableId}`,
          error
        )
        throw failure
      }

      if (!pending.length) {
        break
      }
      if (attempt < ROW_WRITE_ATTEMPTS) {
        await delay(attempt * 250)
      }
    }
    if (pending.length) {
      throw failure
    }
  } catch (error) {
    writeFailed = true
    failure = error
  }
  if (confirmed) {
    const results = await Promise.allSettled([
      quotas.addRows(confirmed, undefined, { tableId }),
      events.rows.imported(table, confirmed),
    ])
    for (const result of results) {
      if (result.status === "rejected") {
        if (!writeFailed) {
          throw result.reason
        }
        console.error("Failed to finalize seeded rows", result.reason)
      }
    }
  }
  if (writeFailed) {
    throw failure
  }
}

export const seedTableRows = async ({
  table,
  prodWorkspaceId,
}: {
  table: Table
  prodWorkspaceId: string
}) => {
  const tableId = table._id!
  const sourceDb = context.getWorkspaceDB()
  await context.doInWorkspaceContext(prodWorkspaceId, async () => {
    const destinationDb = context.getWorkspaceDB()
    let startAfter: string | undefined

    while (true) {
      const response = await sourceDb.allDocs<Row>(
        getRowParams(tableId, null, {
          include_docs: true,
          limit: ROW_PAGE_SIZE + (startAfter ? 1 : 0),
          ...(startAfter ? { startkey: startAfter } : {}),
        })
      )
      // Filter the cursor instead of skipping one result: it may have been
      // deleted since the preceding page was read.
      const page = response.rows
        .filter(row => row.id !== startAfter)
        .slice(0, ROW_PAGE_SIZE)
      if (!page.length) {
        break
      }
      startAfter = page[page.length - 1].id
      const rows = page.flatMap(({ doc }) =>
        doc && !doc._deleted ? [doc] : []
      )

      for (const batch of chunk(rows, ROW_CHUNK_SIZE)) {
        const missing = await findMissingRows({
          db: destinationDb,
          rows: batch,
        })
        if (!missing.length) {
          continue
        }
        const stripped = missing.map(({ _rev, _attachments, ...row }) => row)
        const sanitized = stripIgnoreTimezoneSuffix({ rows: stripped, table })
        await writeRows({ db: destinationDb, rows: sanitized, table })
      }

      if (page.length < ROW_PAGE_SIZE) {
        break
      }
    }
    const autoColumnState = await destinationDb.tryGet<Document>(
      `${DocumentType.AUTO_COLUMN_STATE}${SEPARATOR}${tableId}`
    )
    if (autoColumnState) {
      // Initialize production counters from the preserved IDs on the next insert.
      await destinationDb.remove(autoColumnState._id!, autoColumnState._rev!)
    }
  })
}
