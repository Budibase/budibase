import {
  context,
  sql,
  SQLITE_DESIGN_DOC_ID,
  SQS_DATASOURCE_INTERNAL,
} from "@budibase/backend-core"
import {
  AGENT_REQUEST_TYPE,
  FieldType,
  JsonFieldSubType,
  Operation,
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
  RequestRow,
  SearchFilters,
  Table,
} from "@budibase/types"
import { getContextDoc } from "../../escalations"
import { getEscalationExpiry, getRaisedEscalationIds } from "./inboxRows"

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
  field: "statusRank" | "createdAt" | "updatedAt" | "pendingApprovers"
  direction: SortOrder
  containsValue?: string
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
  await db.put({ ...existing, ...base })
}

const isNotFoundError = (err: unknown) =>
  typeof err === "object" && err !== null && "status" in err
    ? err.status === 404
    : false

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
    request.pendingApprovers.length > 0 &&
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
