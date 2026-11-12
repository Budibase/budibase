import {
  context,
  db as dbCore,
  sql,
  SQLITE_DESIGN_DOC_ID,
  SQS_DATASOURCE_INTERNAL,
} from "@budibase/backend-core"
import {
  AGENT_REQUEST_TYPE,
  DocumentType,
  FieldType,
  JsonFieldSubType,
  Operation,
  SEPARATOR,
  SortOrder,
  SortType,
  SqlClient,
  SQLiteType,
  TableSourceType,
} from "@budibase/types"
import type {
  AgentRequest,
  AgentRequestStatus,
  EnrichedQueryJson,
  EscalationContextDoc,
  PreSaveSQLiteDefinition,
  RequestEscalationState,
  RequestRow,
  SearchFilters,
  Table,
} from "@budibase/types"
import { getContextDoc } from "../../escalationContext"

export const USER_FILTER_FIELDS = [
  "isRequester",
  "isApprover",
  "awaitingMe",
  "awaitingOthers",
  "responded",
] as const

export const EQUAL_FILTER_FIELDS = [
  "status",
  "workspaceId",
  "agentId",
  "operationId",
] as const

export type RequestInboxFilters = Partial<
  Pick<
    RequestRow,
    (typeof USER_FILTER_FIELDS)[number] | (typeof EQUAL_FILTER_FIELDS)[number]
  >
>

export interface RaisedEscalation {
  escalationId: string
  doc: EscalationContextDoc
}

export const getEscalationState = (
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

export const getEscalationExpiry = (doc: EscalationContextDoc) => {
  if (doc.durationMs === undefined || doc.createdAt === undefined) {
    return undefined
  }
  return new Date(
    new Date(doc.createdAt).getTime() + doc.durationMs
  ).toISOString()
}

export const getRaisedEscalationIds = (request: AgentRequest) => [
  ...new Set(
    (request.actions ?? []).flatMap(action =>
      action.type === "escalation_raised" ? [action.escalationId] : []
    )
  ),
]

export const isApproverOn = (doc: EscalationContextDoc, globalUserId: string) =>
  !!doc.policy?.approvers?.includes(globalUserId)

export const hasResponded = (doc: EscalationContextDoc, globalUserId: string) =>
  (doc.approvals ?? []).some(approval => approval.userId === globalUserId)

export const filterVisibleEscalations = ({
  escalations,
  globalUserId,
  isRequester,
}: {
  escalations: RaisedEscalation[]
  globalUserId: string
  isRequester: boolean
}) =>
  isRequester
    ? escalations
    : escalations.filter(({ doc }) => isApproverOn(doc, globalUserId))

export const STATUS_RANK: Record<AgentRequestStatus, number> = {
  needs_input: 0,
  active: 1,
  completed: 2,
  failed: 3,
}

const ARRAY_FIELDS = [
  "approvers",
  "pendingApprovers",
  "respondedApprovers",
] as const

const builder = new sql.Sql(SqlClient.SQL_LITE)

export interface RequestSort {
  field: "statusRank" | "createdAt" | "updatedAt" | "pendingApprovers" | "_id"
  direction: SortOrder
  containsValue?: string
}

const LEGACY_PREFIX = `${DocumentType.AGENT_REQUEST}${SEPARATOR}`

export const toRequestId = (legacyId: string) =>
  `${DocumentType.REQUEST}${SEPARATOR}${legacyId.slice(LEGACY_PREFIX.length)}`

// This might be overkill but, there in a window when the queue parser starts
// and the user actually touches their workspace, which could be hours or days.
// In the event a request is touched beforehand it needs to be live migrated to
// avoid a collision with the migration when it does run.
export async function migrateLegacyRequest(
  legacy: AgentRequest
): Promise<AgentRequest | undefined> {
  const requestsDb = context.getRequestsDB()
  const _id = toRequestId(legacy._id!)
  const existing = await requestsDb.tryGet<AgentRequest>(_id)
  if (existing) {
    return existing
  }
  const { _rev, ...rest } = legacy
  const request = withDerivedFields(
    { ...rest, _id, workspaceId: context.getProdWorkspaceId() },
    await loadRaisedEscalations(legacy)
  )
  try {
    const response = await requestsDb.put(request)
    return { ...request, _rev: response.rev }
  } catch (err) {
    if (dbCore.isDocumentConflictError(err)) {
      return await requestsDb.tryGet<AgentRequest>(_id)
    }
    throw err
  }
}

// Ids read from escalation docs or chat conversations can still be the old
// workspace-scoped shape until the workspace migration has run
export async function getRequest(
  requestId: string
): Promise<AgentRequest | undefined> {
  const request = await context.getRequestsDB().tryGet<AgentRequest>(requestId)
  if (request || !requestId.startsWith(LEGACY_PREFIX)) {
    return request
  }
  const legacy = await context.getWorkspaceDB().tryGet<AgentRequest>(requestId)
  return legacy ? await migrateLegacyRequest(legacy) : undefined
}

export async function loadRaisedEscalations(
  request: AgentRequest
): Promise<EscalationContextDoc[]> {
  const docs = await Promise.all(
    getRaisedEscalationIds(request).map(id => getContextDoc(id))
  )
  return docs.flatMap(doc => (doc ? [doc] : []))
}

export function withDerivedFields(
  request: AgentRequest,
  escalations: EscalationContextDoc[]
): AgentRequest {
  const approvers = new Set<string>()
  const pendingApprovers = new Set<string>()
  const respondedApprovers = new Set<string>()
  const expiries: string[] = []
  for (const doc of escalations) {
    const pending = doc.resolution === "pending"
    const expiresAt = getEscalationExpiry(doc)
    if (pending && expiresAt) {
      expiries.push(expiresAt)
    }
    const responded = new Set(
      (doc.approvals ?? []).map(approval => approval.userId)
    )
    for (const approverId of doc.policy?.approvers ?? []) {
      approvers.add(approverId)
      if (responded.has(approverId)) {
        respondedApprovers.add(approverId)
      } else if (pending) {
        pendingApprovers.add(approverId)
      }
    }
  }
  return {
    ...request,
    type: AGENT_REQUEST_TYPE,
    statusRank: STATUS_RANK[request.status],
    approvers: [...approvers],
    pendingApprovers: [...pendingApprovers],
    respondedApprovers: [...respondedApprovers],
    expiresAt: expiries.sort()[0],
  }
}

function requestsTable(): Table {
  return {
    type: "table",
    sourceType: TableSourceType.INTERNAL,
    name: AGENT_REQUEST_TYPE,
    sourceId: SQS_DATASOURCE_INTERNAL,
    primary: ["_id"],
    schema: Object.fromEntries(
      ARRAY_FIELDS.map(field => [
        field,
        {
          name: field,
          type: FieldType.ARRAY,
          constraints: { type: JsonFieldSubType.ARRAY, inclusion: [] },
        },
      ])
    ),
  }
}

export async function createDesignDoc() {
  const base = sql.designDoc.base("type")
  base.sql.tables = {
    [AGENT_REQUEST_TYPE]: {
      fields: {
        type: SQLiteType.TEXT,
        workspaceId: SQLiteType.TEXT,
        title: SQLiteType.TEXT,
        agentId: SQLiteType.TEXT,
        operationId: SQLiteType.TEXT,
        userId: SQLiteType.TEXT,
        status: SQLiteType.TEXT,
        statusRank: SQLiteType.NUMERIC,
        approvers: SQLiteType.TEXT,
        pendingApprovers: SQLiteType.TEXT,
        respondedApprovers: SQLiteType.TEXT,
        expiresAt: SQLiteType.TEXT,
        createdAt: SQLiteType.TEXT,
        updatedAt: SQLiteType.TEXT,
      },
    },
  }
  const db = context.getRequestsDB()
  const existing =
    await db.tryGet<PreSaveSQLiteDefinition>(SQLITE_DESIGN_DOC_ID)
  try {
    await db.put({ ...existing, ...base })
  } catch (err) {
    if (!dbCore.isDocumentConflictError(err)) {
      throw err
    }
  }
}

const isNotFoundError = (err: unknown) =>
  typeof err === "object" &&
  err !== null &&
  "status" in err &&
  err.status === 404 &&
  "message" in err &&
  typeof err.message === "string" &&
  err.message.includes(SQLITE_DESIGN_DOC_ID)

export async function searchRequests(
  {
    filters,
    sort,
    page,
    limit,
  }: {
    filters: SearchFilters
    sort: RequestSort[]
    page?: number
    limit?: number
  },
  opts: { isRetry?: boolean } = {}
): Promise<{ requests: AgentRequest[]; hasNextPage: boolean }> {
  const request: EnrichedQueryJson = {
    operation: Operation.READ,
    table: requestsTable(),
    tables: {},
    ...(limit
      ? { paginate: { limit: limit + 1, offset: ((page ?? 1) - 1) * limit } }
      : {}),
    filters,
    resource: { fields: [] },
    sort: Object.fromEntries(
      sort.map(({ field, direction, containsValue }) => [
        field,
        {
          direction,
          type: field === "statusRank" ? SortType.NUMBER : SortType.STRING,
          ...(containsValue === undefined ? {} : { containsValue }),
        },
      ])
    ),
  }
  const query = builder._query(request)
  if (Array.isArray(query)) {
    throw new Error("Cannot execute multiple queries for request search")
  }
  try {
    const rows = await context
      .getRequestsDB()
      .sql<AgentRequest>(query.sql, query.bindings)
    const requests = builder.convertJsonStringColumns(
      requestsTable(),
      rows
    ) as AgentRequest[]
    return {
      requests: limit ? requests.slice(0, limit) : requests,
      hasNextPage: !!limit && requests.length > limit,
    }
  } catch (err) {
    if (isNotFoundError(err) && !opts.isRetry) {
      await createDesignDoc()
      return await searchRequests(
        { filters, sort, page, limit },
        { isRetry: true }
      )
    }
    throw err
  }
}

export const getUserFlags = (request: AgentRequest, globalUserId: string) => ({
  isRequester: request.userId === globalUserId,
  isApprover: request.approvers.includes(globalUserId),
  awaitingMe: request.pendingApprovers.includes(globalUserId),
  awaitingOthers:
    request.status === "needs_input" &&
    !request.pendingApprovers.includes(globalUserId),
  responded: request.respondedApprovers.includes(globalUserId),
})

export const isInvolved = (request: AgentRequest, globalUserId: string) =>
  request.userId === globalUserId || request.approvers.includes(globalUserId)

export const toRequestRow = (
  request: AgentRequest,
  globalUserId: string
): RequestRow => ({
  requestId: request._id!,
  workspaceId: request.workspaceId,
  title: request.title,
  agentId: request.agentId,
  operationId: request.operationId,
  status: request.status,
  ...getUserFlags(request, globalUserId),
  expiresAt: request.expiresAt,
  createdAt: request.createdAt,
})
