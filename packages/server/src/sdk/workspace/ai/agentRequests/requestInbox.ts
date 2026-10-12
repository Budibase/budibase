import {
  cache,
  context,
  db as dbCore,
  Duration,
  locks,
  sql,
  SQLITE_DESIGN_DOC_ID,
  SQS_DATASOURCE_INTERNAL,
} from "@budibase/backend-core"
import {
  DocumentType,
  FieldType,
  LockName,
  LockType,
  Operation,
  REQUEST_INBOX_TYPE,
  SEPARATOR,
  SortOrder,
  SortType,
  SqlClient,
  SQLiteType,
  TableSourceType,
  UNICODE_MAX,
} from "@budibase/types"
import type {
  AgentRequest,
  EnrichedQueryJson,
  EscalationContextDoc,
  EscalationRaisedAction,
  FetchRequestsResponse,
  FindRequestResponse,
  PreSaveSQLiteDefinition,
  RequestEscalationState,
  RequestInboxDoc,
  RequestRow,
  Table,
} from "@budibase/types"
import { getContextDoc } from "../../escalations"
import { getFullUser } from "../../../../utilities/users"

const MAX_CONFLICT_RETRIES = 3
const REQUEST_INBOX_LOCK_TTL_MS = Duration.fromSeconds(10).toMs()
const AGENT_REQUEST_PREFIX = `${DocumentType.AGENT_REQUEST}${SEPARATOR}`

const builder = new sql.Sql(SqlClient.SQL_LITE)

const ROW_FIELDS = [
  "type",
  "globalUserId",
  "workspaceId",
  "requestId",
  "title",
  "agentId",
  "operationId",
  "status",
  "needsInput",
  "isRequester",
  "isApprover",
  "awaitingResponse",
  "respondedPending",
  "expiresAt",
  "createdAt",
] as const

const FILTER_FIELDS = [
  "isRequester",
  "isApprover",
  "awaitingResponse",
  "respondedPending",
  "status",
  "workspaceId",
  "agentId",
  "operationId",
] as const

const BOOLEAN_FIELDS = [
  "needsInput",
  "isRequester",
  "isApprover",
  "awaitingResponse",
  "respondedPending",
] as const

export type RequestInboxFilters = Partial<
  Pick<RequestInboxDoc, (typeof FILTER_FIELDS)[number]>
>

interface RaisedEscalation {
  escalationId: string
  doc: EscalationContextDoc
}

interface Involvement {
  isRequester: boolean
  isApprover: boolean
  awaitingResponse: boolean
  respondedPending: boolean
  expiries: string[]
}

function inboxTable(): Table {
  return {
    type: "table",
    sourceType: TableSourceType.INTERNAL,
    name: REQUEST_INBOX_TYPE,
    sourceId: SQS_DATASOURCE_INTERNAL,
    primary: ["_id"],
    schema: Object.fromEntries(
      BOOLEAN_FIELDS.map(field => [
        field,
        { name: field, type: FieldType.BOOLEAN },
      ])
    ),
  }
}

export async function createDesignDoc() {
  const base = sql.designDoc.base("type")
  base.sql.tables = {
    [REQUEST_INBOX_TYPE]: {
      fields: {
        type: SQLiteType.TEXT,
        globalUserId: SQLiteType.TEXT,
        workspaceId: SQLiteType.TEXT,
        requestId: SQLiteType.TEXT,
        title: SQLiteType.TEXT,
        agentId: SQLiteType.TEXT,
        operationId: SQLiteType.TEXT,
        status: SQLiteType.TEXT,
        needsInput: SQLiteType.NUMERIC,
        isRequester: SQLiteType.NUMERIC,
        isApprover: SQLiteType.NUMERIC,
        awaitingResponse: SQLiteType.NUMERIC,
        respondedPending: SQLiteType.NUMERIC,
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
  const equal: Record<string, string | boolean> = { globalUserId }
  for (const field of FILTER_FIELDS) {
    const value = filters[field]
    if (value !== undefined) {
      equal[field] = value
    }
  }
  const request: EnrichedQueryJson = {
    operation: Operation.READ,
    table: inboxTable(),
    tables: {},
    paginate: {
      limit: limit + 1,
      offset: (page - 1) * limit,
    },
    filters: { equal },
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

const rowId = ({
  workspaceId,
  requestId,
  globalUserId,
}: {
  workspaceId: string
  requestId: string
  globalUserId: string
}) =>
  [
    DocumentType.REQUEST_INBOX,
    workspaceId,
    requestId.slice(AGENT_REQUEST_PREFIX.length),
    globalUserId,
  ].join(SEPARATOR)

export const escalationStateOf = (
  doc: EscalationContextDoc
): RequestEscalationState => {
  if (doc.resolution === "pending" || doc.resolution === "cancelled") {
    return doc.resolution
  }
  if (doc.resolution === "expired" && !doc.response?.actionId) {
    return "expired"
  }
  return doc.response?.accepted === true ? "approved" : "rejected"
}

const expiresAtOf = (doc: EscalationContextDoc) => {
  if (doc.durationMs === undefined || doc.createdAt === undefined) {
    return undefined
  }
  return new Date(
    new Date(doc.createdAt).getTime() + doc.durationMs
  ).toISOString()
}

const raisedEscalationIds = (request: AgentRequest) => [
  ...new Set(
    (request.actions ?? []).flatMap(action =>
      action.type === "escalation_raised" ? [action.escalationId] : []
    )
  ),
]

async function loadRaisedEscalations(
  request: AgentRequest
): Promise<RaisedEscalation[]> {
  const loaded = await Promise.all(
    raisedEscalationIds(request).map(async escalationId => ({
      escalationId,
      doc: await getContextDoc(escalationId),
    }))
  )
  return loaded.flatMap(({ escalationId, doc }) =>
    doc ? [{ escalationId, doc }] : []
  )
}

export function buildRequestInboxRows({
  request,
  escalations,
  workspaceId,
}: {
  request: AgentRequest
  escalations: RaisedEscalation[]
  workspaceId: string
}): RequestInboxDoc[] {
  if (!request._id) {
    return []
  }
  const requestId = request._id
  const people = new Map<string, Involvement>()
  const involvementOf = (globalUserId: string) => {
    const existing = people.get(globalUserId)
    if (existing) {
      return existing
    }
    const involvement: Involvement = {
      isRequester: false,
      isApprover: false,
      awaitingResponse: false,
      respondedPending: false,
      expiries: [],
    }
    people.set(globalUserId, involvement)
    return involvement
  }

  if (request.userId) {
    const requester = involvementOf(request.userId)
    requester.isRequester = true
    for (const { doc } of escalations) {
      const expiresAt = expiresAtOf(doc)
      if (doc.resolution === "pending" && expiresAt) {
        requester.expiries.push(expiresAt)
      }
    }
  }
  for (const { doc } of escalations) {
    const expiresAt = expiresAtOf(doc)
    for (const approverId of doc.policy?.approvers ?? []) {
      const approver = involvementOf(approverId)
      approver.isApprover = true
      if (doc.resolution !== "pending") {
        continue
      }
      const responded = (doc.approvals ?? []).some(
        approval => approval.userId === approverId
      )
      if (responded) {
        approver.respondedPending = true
      } else {
        approver.awaitingResponse = true
      }
      if (expiresAt) {
        approver.expiries.push(expiresAt)
      }
    }
  }

  return [...people].map(([globalUserId, involvement]) => ({
    _id: rowId({ workspaceId, requestId, globalUserId }),
    type: REQUEST_INBOX_TYPE,
    globalUserId,
    workspaceId,
    requestId,
    title: request.title,
    agentId: request.agentId,
    operationId: request.operationId,
    status: request.status,
    needsInput: request.status === "needs_input",
    createdAt: request.createdAt,
    isRequester: involvement.isRequester,
    isApprover: involvement.isApprover,
    awaitingResponse: involvement.awaitingResponse,
    respondedPending: involvement.respondedPending,
    expiresAt: involvement.expiries.sort()[0],
  }))
}

const isSameRow = (row: RequestInboxDoc, existing?: RequestInboxDoc) =>
  !!existing && ROW_FIELDS.every(field => existing[field] === row[field])

async function writeRows(rows: RequestInboxDoc[]) {
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

const withRequestInboxLock = <T>(requestId: string, task: () => Promise<T>) =>
  locks.doWithLock(
    {
      name: LockName.REQUEST_INBOX_SYNC,
      resource: requestId,
      type: LockType.DEFAULT,
      ttl: REQUEST_INBOX_LOCK_TTL_MS,
    },
    task
  )

async function syncRequestRows(requestId: string) {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    return
  }
  await withRequestInboxLock(requestId, async () => {
    const request = await context
      .getWorkspaceDB()
      .tryGet<AgentRequest>(requestId)
    if (!request) {
      return
    }
    const escalations = await loadRaisedEscalations(request)
    await writeRows(
      buildRequestInboxRows({
        request,
        escalations,
        workspaceId: dbCore.getProdWorkspaceID(workspaceId),
      })
    )
  })
}

export async function syncRequestInbox(request: AgentRequest): Promise<void> {
  if (!request._id) {
    return
  }
  try {
    await syncRequestRows(request._id)
  } catch (error) {
    console.error("Request inbox: failed to sync request", {
      requestId: request._id,
      error,
    })
  }
}

export async function deleteWorkspaceRows(workspaceId: string) {
  try {
    const prefix = [
      DocumentType.REQUEST_INBOX,
      dbCore.getProdWorkspaceID(workspaceId),
      "",
    ].join(SEPARATOR)
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

export async function syncRequestInboxForEscalation(
  escalationId: string
): Promise<void> {
  try {
    const doc = await getContextDoc(escalationId)
    if (doc?.requestId) {
      await syncRequestRows(doc.requestId)
    }
  } catch (error) {
    console.error("Request inbox: failed to sync escalation", {
      escalationId,
      error,
    })
  }
}

async function getWorkspaceName(workspaceId: string) {
  const metadata = await cache.workspace.getWorkspaceMetadata(workspaceId)
  return "name" in metadata ? metadata.name : undefined
}

const matchesFilters = (row: RequestInboxDoc, filters: RequestInboxFilters) =>
  FILTER_FIELDS.every(
    field => filters[field] === undefined || row[field] === filters[field]
  )

const toRequestRow = (row: RequestInboxDoc): RequestRow => ({
  requestId: row.requestId,
  workspaceId: row.workspaceId,
  title: row.title,
  agentId: row.agentId,
  operationId: row.operationId,
  status: row.status,
  isRequester: row.isRequester,
  isApprover: row.isApprover,
  awaitingResponse: row.awaitingResponse,
  respondedPending: row.respondedPending,
  expiresAt: row.expiresAt,
  createdAt: row.createdAt,
})

async function verifyWorkspaceRows({
  workspaceId,
  rows,
  filters,
}: {
  workspaceId: string
  rows: RequestInboxDoc[]
  filters: RequestInboxFilters
}): Promise<Map<string, RequestRow>> {
  return await context.doInWorkspaceContext(workspaceId, async () => {
    const db = context.getWorkspaceDB()
    const requestIds = [...new Set(rows.map(row => row.requestId))]
    const freshRows = new Map<string, RequestInboxDoc>()
    for (const requestId of requestIds) {
      const request = await db.tryGet<AgentRequest>(requestId)
      if (!request) {
        continue
      }
      const escalations = await loadRaisedEscalations(request)
      for (const fresh of buildRequestInboxRows({
        request,
        escalations,
        workspaceId,
      })) {
        freshRows.set(fresh._id, fresh)
      }
    }
    const verified = new Map<string, RequestRow>()
    for (const row of rows) {
      const fresh = freshRows.get(row._id)
      if (
        fresh &&
        fresh.globalUserId === row.globalUserId &&
        matchesFilters(fresh, filters)
      ) {
        verified.set(row._id, toRequestRow(fresh))
      }
    }
    return verified
  })
}

export async function fetchRequestsForUser({
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
}): Promise<FetchRequestsResponse> {
  const { rows, hasNextPage } = await searchRequestInbox({
    globalUserId,
    filters,
    order,
    page,
    limit,
  })
  const workspaceIds = [...new Set(rows.map(row => row.workspaceId))]
  const verifiedByWorkspace = await Promise.all(
    workspaceIds.map(workspaceId =>
      verifyWorkspaceRows({
        workspaceId,
        rows: rows.filter(row => row.workspaceId === workspaceId),
        filters,
      })
    )
  )
  const verified = new Map(
    verifiedByWorkspace.flatMap(workspaceRows => [...workspaceRows])
  )
  return {
    requests: rows.flatMap(row => verified.get(row._id) ?? []),
    page,
    hasNextPage,
  }
}

async function resolveUserName(userId: string) {
  try {
    const user = await getFullUser(userId)
    return user.fullName || user.email
  } catch (error) {
    console.error("Request inbox: failed to resolve user", { userId, error })
    return undefined
  }
}

async function resolveSubmittedBy(
  request: AgentRequest,
  escalations: RaisedEscalation[]
) {
  return (
    (await resolveUserName(request.userId)) ||
    escalations.at(-1)?.doc.reviewContext?.requestedBy ||
    "Unknown requester"
  )
}

export async function findRequestForUser({
  requestId,
  globalUserId,
}: {
  requestId: string
  globalUserId: string
}): Promise<FindRequestResponse | undefined> {
  const currentWorkspaceId = context.getWorkspaceId()
  if (!currentWorkspaceId || !requestId.startsWith(AGENT_REQUEST_PREFIX)) {
    return undefined
  }
  const request = await context.getWorkspaceDB().tryGet<AgentRequest>(requestId)
  if (!request) {
    return undefined
  }
  const workspaceId = dbCore.getProdWorkspaceID(currentWorkspaceId)
  const escalations = await loadRaisedEscalations(request)
  const userRow = buildRequestInboxRows({
    request,
    escalations,
    workspaceId,
  }).find(row => row.globalUserId === globalUserId)
  if (!userRow) {
    return undefined
  }

  const approverEscalationIds = new Set(
    escalations
      .filter(({ doc }) => doc.policy?.approvers?.includes(globalUserId))
      .map(({ escalationId }) => escalationId)
  )
  const visibleEscalations = userRow.isRequester
    ? escalations
    : escalations.filter(({ escalationId }) =>
        approverEscalationIds.has(escalationId)
      )
  const recipientsByEscalation = new Map<
    string,
    EscalationRaisedAction["recipients"]
  >()
  for (const action of request.actions ?? []) {
    if (action.type === "escalation_raised") {
      recipientsByEscalation.set(action.escalationId, action.recipients)
    }
  }
  const responderIds = [
    ...new Set(
      visibleEscalations.flatMap(({ doc }) =>
        (doc.approvals ?? []).map(approval => approval.userId)
      )
    ),
  ]
  const responderNames = new Map(
    await Promise.all(
      responderIds.map(
        async userId => [userId, await resolveUserName(userId)] as const
      )
    )
  )

  return {
    requestId,
    workspaceId,
    workspaceName: await getWorkspaceName(workspaceId),
    title: request.title,
    agentId: request.agentId,
    operationId: request.operationId,
    status: request.status,
    createdAt: request.createdAt,
    submittedBy: await resolveSubmittedBy(request, escalations),
    source: request.entries.at(-1)?.source,
    isRequester: userRow.isRequester,
    escalations: visibleEscalations.map(({ escalationId, doc }) => ({
      escalationId,
      title: doc.title,
      operationId: doc.operationId,
      recipients: recipientsByEscalation.get(escalationId) ?? [],
      state: escalationStateOf(doc),
      expiresAt: expiresAtOf(doc),
      isApprover: approverEscalationIds.has(escalationId),
      responded: (doc.approvals ?? []).some(
        approval => approval.userId === globalUserId
      ),
      approverCount: doc.policy?.approvers?.length ?? 0,
      approvals: (doc.approvals ?? []).map(approval => ({
        userId: approval.userId,
        name: responderNames.get(approval.userId) || "Unknown user",
        actionId: approval.actionId,
        respondedAt: approval.respondedAt,
        note: approval.note,
      })),
    })),
  }
}
