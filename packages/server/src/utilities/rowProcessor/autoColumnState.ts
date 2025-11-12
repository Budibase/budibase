import { context } from "@budibase/backend-core"
import { Document, DocumentType, Row, Table, SEPARATOR } from "@budibase/types"
import { getRowParams } from "../../db/utils"

const AUTO_COLUMN_STATE_DOC_PREFIX = `${DocumentType.AUTO_COLUMN_STATE}${SEPARATOR}`
const MAX_ALLOCATE_ATTEMPTS = 5

interface AutoColumnStateDoc extends Document {
  tableId: string
  columns: Record<string, number>
}

const isConflictError = (err: any) =>
  err?.status === 409 || err?.statusCode === 409

function buildDocId(tableId: string) {
  return `${AUTO_COLUMN_STATE_DOC_PREFIX}${tableId}`
}

function getSchemaSeed(table: Table, columnName: string): number {
  const schema = table.schema[columnName] as
    | {
        lastId?: number
      }
    | undefined
  if (schema?.lastId != null && !Number.isNaN(schema.lastId)) {
    return schema.lastId
  }
  return 0
}

async function computeRowMaxes(
  table: Table,
  columnNames: string[]
): Promise<Record<string, number>> {
  const maxes: Record<string, number> = {}
  if (!columnNames.length) {
    return maxes
  }

  const db = context.getWorkspaceDB()
  const response = await db.allDocs<Row>(
    getRowParams(table._id!, null, {
      include_docs: true,
    })
  )

  for (const columnName of columnNames) {
    maxes[columnName] = 0
  }

  for (const row of response.rows) {
    const doc = row.doc
    if (!doc) {
      continue
    }
    for (const columnName of columnNames) {
      const currentValue = doc[columnName]
      if (typeof currentValue !== "number") {
        continue
      }

      const currentMax = maxes[columnName] ?? 0
      const isNewMaximum = currentValue > currentMax
      if (isNewMaximum) {
        maxes[columnName] = currentValue
      }
    }
  }

  return maxes
}

async function initialiseMissingColumns(
  state: AutoColumnStateDoc,
  table: Table,
  columnNames: string[]
) {
  const missing = columnNames.filter(
    columnName => state.columns[columnName] == null
  )
  if (!missing.length) {
    return
  }

  const rowMaxes = await computeRowMaxes(table, missing)

  for (const columnName of missing) {
    const schemaSeed = getSchemaSeed(table, columnName)
    const rowMax = rowMaxes[columnName] ?? 0
    state.columns[columnName] = Math.max(schemaSeed, rowMax)
  }
}

export async function allocateAutoColumnValues(
  table: Table,
  columnNames: string[]
): Promise<Record<string, number>> {
  if (!columnNames.length) {
    return {}
  }
  if (!table._id) {
    throw new Error(
      "Unable to allocate auto column values for table without an _id."
    )
  }

  const db = context.getWorkspaceDB()
  const docId = buildDocId(table._id)
  const uniqueColumns = [...new Set(columnNames)]

  let attempt = 0
  while (attempt < MAX_ALLOCATE_ATTEMPTS) {
    let state =
      (await db.tryGet<AutoColumnStateDoc>(docId)) ||
      ({
        _id: docId,
        tableId: table._id,
        columns: {},
      } as AutoColumnStateDoc)

    await initialiseMissingColumns(state, table, uniqueColumns)

    const updatedState: AutoColumnStateDoc = {
      ...state,
      columns: { ...state.columns },
    }
    const allocations: Record<string, number> = {}

    for (const columnName of uniqueColumns) {
      const current = updatedState.columns[columnName] ?? 0
      const next = current + 1
      updatedState.columns[columnName] = next
      allocations[columnName] = next
    }

    try {
      const response = await db.put(updatedState)
      updatedState._rev = response.rev
      return allocations
    } catch (err: any) {
      if (isConflictError(err)) {
        attempt++
        continue
      }
      throw err
    }
  }

  throw new Error(
    `Unable to allocate auto column values for table ${table._id} after ${MAX_ALLOCATE_ATTEMPTS} attempts`
  )
}
