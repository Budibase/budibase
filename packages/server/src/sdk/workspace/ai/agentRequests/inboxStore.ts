import {
  context,
  db as dbCore,
  Duration,
  locks,
  sql,
  SQLITE_DESIGN_DOC_ID,
  SQS_DATASOURCE_INTERNAL,
} from "@budibase/backend-core"
import {
  FieldType,
  LockName,
  LockType,
  Operation,
  REQUEST_INBOX_TYPE,
  SortOrder,
  SortType,
  SqlClient,
  SQLiteType,
  TableSourceType,
  UNICODE_MAX,
} from "@budibase/types"
import type {
  EnrichedQueryJson,
  PreSaveSQLiteDefinition,
  RequestInboxDoc,
  SearchFilters,
  Table,
} from "@budibase/types"
import { EQUAL_FILTER_FIELDS, workspaceRowPrefix } from "./inboxRows"
import type { RequestInboxFilters } from "./inboxRows"

const MAX_CONFLICT_RETRIES = 3
const REQUEST_INBOX_LOCK_TTL_MS = Duration.fromSeconds(10).toMs()

const builder = new sql.Sql(SqlClient.SQL_LITE)

const DOC_FIELDS = [
  "type",
  "workspaceId",
  "requestId",
  "title",
  "agentId",
  "operationId",
  "status",
  "needsInput",
  "requester",
  "approvers",
  "pendingApprovers",
  "respondedApprovers",
  "expiresAt",
  "createdAt",
] as const

const ARRAY_FIELDS = [
  "approvers",
  "pendingApprovers",
  "respondedApprovers",
] as const

const USER_ARRAY_FOR_FILTER = {
  isApprover: "approvers",
  awaitingMe: "pendingApprovers",
  responded: "respondedApprovers",
} as const

function inboxTable(): Table {
  return {
    type: "table",
    sourceType: TableSourceType.INTERNAL,
    name: REQUEST_INBOX_TYPE,
    sourceId: SQS_DATASOURCE_INTERNAL,
    primary: ["_id"],
    schema: {
      needsInput: { name: "needsInput", type: FieldType.BOOLEAN },
      ...Object.fromEntries(
        ARRAY_FIELDS.map(field => [
          field,
          {
            name: field,
            type: FieldType.ARRAY,
            constraints: { inclusion: [] },
          },
        ])
      ),
    },
  }
}

export async function createDesignDoc() {
  const base = sql.designDoc.base("type")
  base.sql.tables = {
    [REQUEST_INBOX_TYPE]: {
      fields: {
        type: SQLiteType.TEXT,
        workspaceId: SQLiteType.TEXT,
        requestId: SQLiteType.TEXT,
        title: SQLiteType.TEXT,
        agentId: SQLiteType.TEXT,
        operationId: SQLiteType.TEXT,
        status: SQLiteType.TEXT,
        needsInput: SQLiteType.NUMERIC,
        requester: SQLiteType.TEXT,
        approvers: SQLiteType.TEXT,
        pendingApprovers: SQLiteType.TEXT,
        respondedApprovers: SQLiteType.TEXT,
        expiresAt: SQLiteType.TEXT,
        createdAt: SQLiteType.TEXT,
        updatedAt: SQLiteType.TEXT,
      },
    },
  }
  const db = context.getRequestInboxDB()
  const existing =
    await db.tryGet<PreSaveSQLiteDefinition>(SQLITE_DESIGN_DOC_ID)
  await db.put({ ...existing, ...base })
}

const isNotFoundError = (err: unknown) =>
  typeof err === "object" && err !== null && "status" in err
    ? err.status === 404
    : false

export async function searchRequestInbox(
  {
    globalUserId,
    filters,
    order,
    page,
    limit,
  }: {
    globalUserId: string
    filters: RequestInboxFilters
    order: SortOrder
    page: number
    limit: number
  },
  opts: { isRetry?: boolean } = {}
): Promise<{ rows: RequestInboxDoc[]; hasNextPage: boolean }> {
  const equal: Record<string, string> = {}
  const notEqual: Record<string, string> = {}
  const contains: Record<string, string[]> = {}
  const notContains: Record<string, string[]> = {}
  for (const field of EQUAL_FILTER_FIELDS) {
    const value = filters[field]
    if (value !== undefined) {
      equal[field] = value
    }
  }
  if (filters.isRequester !== undefined) {
    ;(filters.isRequester ? equal : notEqual).requester = globalUserId
  }
  for (const [field, column] of Object.entries(USER_ARRAY_FOR_FILTER)) {
    const value = filters[field as keyof typeof USER_ARRAY_FOR_FILTER]
    if (value !== undefined) {
      ;(value ? contains : notContains)[column] = [globalUserId]
    }
  }
  const conditions: SearchFilters[] = [
    {
      $or: {
        conditions: [
          { equal: { requester: globalUserId } },
          { contains: { approvers: [globalUserId] } },
        ],
      },
    },
    { equal, notEqual, contains, notContains },
  ]
  if (filters.awaitingOthers === true) {
    conditions.push({
      equal: { needsInput: true },
      notContains: { pendingApprovers: [globalUserId] },
    })
  } else if (filters.awaitingOthers === false) {
    conditions.push({
      $or: {
        conditions: [
          { equal: { needsInput: false } },
          { contains: { pendingApprovers: [globalUserId] } },
        ],
      },
    })
  }
  const searchFilters: SearchFilters = { $and: { conditions } }
  const request: EnrichedQueryJson = {
    operation: Operation.READ,
    table: inboxTable(),
    tables: {},
    paginate: {
      limit: limit + 1,
      offset: (page - 1) * limit,
    },
    filters: searchFilters,
    resource: {
      fields: [],
    },
    sort: {
      needsInput: {
        direction: SortOrder.DESCENDING,
        type: SortType.NUMBER,
      },
      status: {
        direction: SortOrder.ASCENDING,
        type: SortType.STRING,
      },
      createdAt: {
        direction: order,
        type: SortType.STRING,
      },
    },
  }
  const query = builder._query(request)
  if (Array.isArray(query)) {
    throw new Error("Cannot execute multiple queries for request inbox search")
  }

  try {
    const rows = await context
      .getRequestInboxDB()
      .sql<RequestInboxDoc>(query.sql, query.bindings)
    return {
      rows: rows.slice(0, limit),
      hasNextPage: rows.length > limit,
    }
  } catch (err) {
    if (isNotFoundError(err) && !opts.isRetry) {
      await createDesignDoc()
      return await searchRequestInbox(
        { globalUserId, filters, order, page, limit },
        { isRetry: true }
      )
    }
    throw err
  }
}

const docFingerprint = (doc: RequestInboxDoc) =>
  JSON.stringify(DOC_FIELDS.map(field => doc[field]))

const isSameRow = (row: RequestInboxDoc, existing?: RequestInboxDoc) =>
  !!existing && docFingerprint(existing) === docFingerprint(row)

export async function writeRows(rows: RequestInboxDoc[]) {
  const db = context.getRequestInboxDB()
  let pending = rows
  for (let attempt = 0; attempt < MAX_CONFLICT_RETRIES; attempt++) {
    const existing = await db.getMultiple<RequestInboxDoc>(
      pending.map(row => row._id),
      { allowMissing: true }
    )
    const byId = new Map(existing.map(doc => [doc._id, doc]))
    const changed = pending
      .filter(row => !isSameRow(row, byId.get(row._id)))
      .map(row => ({
        ...row,
        _rev: byId.get(row._id)?._rev,
        updatedAt: new Date().toISOString(),
      }))
    if (!changed.length) {
      return
    }
    const results = await db.bulkDocs(changed)
    const conflicted = new Set(
      results.flatMap(result =>
        result.error === "conflict" && result.id ? [result.id] : []
      )
    )
    const failed = results.filter(
      result => result.error && result.error !== "conflict"
    )
    if (failed.length) {
      console.error("Request inbox: failed to write rows", { failed })
    }
    pending = pending.filter(row => conflicted.has(row._id))
    if (!pending.length) {
      return
    }
  }
  console.error("Request inbox: gave up on conflicted rows", {
    rowIds: pending.map(row => row._id),
  })
}

export const withRequestInboxLock = <T>(
  requestId: string,
  task: () => Promise<T>
) =>
  locks.doWithLock(
    {
      name: LockName.REQUEST_INBOX_SYNC,
      resource: requestId,
      type: LockType.DEFAULT,
      ttl: REQUEST_INBOX_LOCK_TTL_MS,
    },
    task
  )

export async function deleteWorkspaceRows(workspaceId: string) {
  try {
    const prefix = workspaceRowPrefix(dbCore.getProdWorkspaceID(workspaceId))
    const db = context.getRequestInboxDB()
    const response = await db.allDocs<RequestInboxDoc>({
      startkey: prefix,
      endkey: `${prefix}${UNICODE_MAX}`,
      include_docs: true,
    })
    const docs = response.rows.flatMap(row => (row.doc ? [row.doc] : []))
    if (docs.length) {
      await db.bulkRemove(docs)
    }
  } catch (error) {
    console.error("Request inbox: failed to delete workspace rows", {
      workspaceId,
      error,
    })
  }
}
