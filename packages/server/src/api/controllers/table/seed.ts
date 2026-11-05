import { chunk } from "lodash"
import { context, events } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { FieldType, QuotaUsageType, StaticQuotaName } from "@budibase/types"
import type { Database, Row, Table } from "@budibase/types"
import { getRowParams } from "../../../db/utils"
import sdk from "../../../sdk"
import { parse } from "../../../utilities/schema"
import { importToRows } from "./utils"

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
  tableId,
}: {
  db: Database
  rows: Row[]
  tableId: string
}) => {
  await quotas.updateUsage({
    usageChange: rows.length,
    name: StaticQuotaName.ROWS,
    type: QuotaUsageType.STATIC,
    opts: { dryRun: true, id: tableId },
  })

  let pending = rows
  let confirmed = 0
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
        return
      }

      // A failed request can still commit rows. Keep their IDs and retry only
      // documents confirmed missing, without overwriting production changes.
      try {
        const missing = await findMissingRows({ db, rows: pending })
        confirmed += pending.length - missing.length
        pending = missing
      } catch {
        throw failure
      }

      if (!pending.length) {
        return
      }
      if (attempt < ROW_WRITE_ATTEMPTS) {
        await delay(attempt * 250)
      }
    }
    throw failure
  } finally {
    if (confirmed) {
      await quotas.addRows(confirmed, undefined, { tableId })
    }
  }
}

export const seedTableRows = async ({
  tableId,
  prodWorkspaceId,
  userId,
}: {
  tableId: string
  prodWorkspaceId: string
  userId?: string
}) => {
  const sourceDb = context.getWorkspaceDB()
  await context.doInWorkspaceContext(prodWorkspaceId, async () => {
    const destinationDb = context.getWorkspaceDB()
    const table = await sdk.tables.getTable(tableId)
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
        const prepared = await importToRows(
          parse(sanitized, table),
          table,
          userId,
          {
            keepCouchId: true,
          }
        )
        await writeRows({ db: destinationDb, rows: prepared, tableId })
        await events.rows.imported(table, prepared.length)
      }

      if (page.length < ROW_PAGE_SIZE) {
        break
      }
    }
  })
}
