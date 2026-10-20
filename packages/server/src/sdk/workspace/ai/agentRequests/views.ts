import { context, db, HTTPError, ViewName } from "@budibase/backend-core"
import { AGENT_REQUEST_TYPE, SortOrder } from "@budibase/types"
import type {
  AgentRequest,
  AgentRequestStatus,
  DatabaseQueryOpts,
} from "@budibase/types"
import { searchRequests, STATUS_RANK } from "./requestsStore"

const isRequest = `doc.type === "${AGENT_REQUEST_TYPE}"`

const byWorkspaceView = `function(doc) {
  if (${isRequest}) {
    emit([doc.workspaceId, doc.updatedAt || doc.createdAt], null)
  }
}`

const byWorkspaceStatusView = `function(doc) {
  if (${isRequest}) {
    emit([doc.workspaceId, doc.status, doc.updatedAt || doc.createdAt], null)
  }
}`

const byWorkspaceAgentView = `function(doc) {
  if (${isRequest}) {
    emit([doc.workspaceId, doc.agentId, doc.updatedAt || doc.createdAt], null)
  }
}`

const byUserView = `function(doc) {
  if (${isRequest}) {
    emit(doc.userId, null)
    for (var i = 0; i < doc.approvers.length; i++) {
      if (doc.approvers[i] !== doc.userId) {
        emit(doc.approvers[i], null)
      }
    }
  }
}`

const countByStatusView = `function(doc) {
  if (${isRequest}) {
    emit([doc.workspaceId, doc.status], 1)
  }
}`

const createByWorkspaceView = () =>
  db.createView(
    context.getRequestsDB(),
    byWorkspaceView,
    ViewName.REQUESTS_BY_WORKSPACE
  )
const createByWorkspaceStatusView = () =>
  db.createView(
    context.getRequestsDB(),
    byWorkspaceStatusView,
    ViewName.REQUESTS_BY_WORKSPACE_STATUS
  )
const createByWorkspaceAgentView = () =>
  db.createView(
    context.getRequestsDB(),
    byWorkspaceAgentView,
    ViewName.REQUESTS_BY_WORKSPACE_AGENT
  )
const createByUserView = () =>
  db.createView(context.getRequestsDB(), byUserView, ViewName.REQUESTS_BY_USER)
const createCountByStatusView = () =>
  db.createView(
    context.getRequestsDB(),
    countByStatusView,
    ViewName.REQUESTS_COUNT_BY_STATUS,
    "_count"
  )

export interface RequestsPage {
  requests: AgentRequest[]
  bookmark?: string
}

const encodeBookmark = (request: AgentRequest) =>
  Buffer.from(
    JSON.stringify([request.updatedAt || request.createdAt, request._id])
  ).toString("base64url")

const decodeBookmark = (bookmark: string): [string, string] => {
  let parsed: unknown
  try {
    parsed = JSON.parse(Buffer.from(bookmark, "base64url").toString())
  } catch {
    throw new HTTPError("Invalid bookmark query", 400)
  }
  if (
    !Array.isArray(parsed) ||
    parsed.length !== 2 ||
    typeof parsed[0] !== "string" ||
    typeof parsed[1] !== "string"
  ) {
    throw new HTTPError("Invalid bookmark query", 400)
  }
  return [parsed[0], parsed[1]]
}

const pageOpts = (
  prefix: string[],
  limit: number,
  bookmark?: string
): DatabaseQueryOpts => {
  const [key, id] = bookmark ? decodeBookmark(bookmark) : []
  return {
    include_docs: true,
    descending: true,
    limit: limit + 1,
    startkey: [...prefix, key ?? {}],
    endkey: prefix,
    ...(id ? { startkey_docid: id, skip: 1 } : {}),
  }
}

const toPage = (rows: AgentRequest[], limit: number): RequestsPage => ({
  requests: rows.slice(0, limit),
  bookmark: rows.length > limit ? encodeBookmark(rows[limit - 1]) : undefined,
})

export const queryRequestsByWorkspace = async ({
  limit,
  bookmark,
}: {
  limit: number
  bookmark?: string
}): Promise<RequestsPage> => {
  const rows = (await db.queryView<AgentRequest>(
    ViewName.REQUESTS_BY_WORKSPACE,
    pageOpts([context.getProdWorkspaceId()], limit, bookmark),
    context.getRequestsDB(),
    createByWorkspaceView,
    { arrayResponse: true }
  )) as AgentRequest[]
  return toPage(rows, limit)
}

export const queryRequestsByWorkspaceStatus = async ({
  status,
  limit,
  bookmark,
}: {
  status: AgentRequestStatus
  limit: number
  bookmark?: string
}): Promise<RequestsPage> => {
  const rows = (await db.queryView<AgentRequest>(
    ViewName.REQUESTS_BY_WORKSPACE_STATUS,
    pageOpts([context.getProdWorkspaceId(), status], limit, bookmark),
    context.getRequestsDB(),
    createByWorkspaceStatusView,
    { arrayResponse: true }
  )) as AgentRequest[]
  return toPage(rows, limit)
}

export const queryAllRequestsByWorkspace = async (
  workspaceId: string
): Promise<AgentRequest[]> =>
  (await db.queryView<AgentRequest>(
    ViewName.REQUESTS_BY_WORKSPACE,
    {
      include_docs: true,
      startkey: [workspaceId],
      endkey: [workspaceId, {}],
    },
    context.getRequestsDB(),
    createByWorkspaceView,
    { arrayResponse: true }
  )) as AgentRequest[]

export const queryRequestsByWorkspaceAgent = async (
  agentId: string
): Promise<AgentRequest[]> => {
  const workspaceId = context.getProdWorkspaceId()
  return (await db.queryView<AgentRequest>(
    ViewName.REQUESTS_BY_WORKSPACE_AGENT,
    {
      include_docs: true,
      descending: true,
      startkey: [workspaceId, agentId, {}],
      endkey: [workspaceId, agentId],
    },
    context.getRequestsDB(),
    createByWorkspaceAgentView,
    { arrayResponse: true }
  )) as AgentRequest[]
}

export const queryRequestsByAgentAndUser = async ({
  agentId,
  userId,
  limit,
  page,
}: {
  agentId: string
  userId: string
  limit: number
  page: number
}): Promise<AgentRequest[]> => {
  const { requests } = await searchRequests({
    filters: {
      equal: { workspaceId: context.getProdWorkspaceId(), agentId, userId },
    },
    sort: [
      { field: "updatedAt", direction: SortOrder.DESCENDING },
      { field: "_id", direction: SortOrder.DESCENDING },
    ],
    page,
    limit,
  })
  return await context.getRequestsDB().getMultiple<AgentRequest>(
    requests.map(request => request._id!),
    { allowMissing: true }
  )
}

export const queryRequestIdsByUser = async (
  globalUserId: string
): Promise<string[]> => {
  const response = await db.queryViewRaw<AgentRequest>(
    ViewName.REQUESTS_BY_USER,
    { key: globalUserId },
    context.getRequestsDB(),
    createByUserView
  )
  return [...new Set(response.rows.map(row => row.id))]
}

export const queryRequestCountsByStatus = async (): Promise<
  Record<AgentRequestStatus, number>
> => {
  const workspaceId = context.getProdWorkspaceId()
  const response = await db.queryViewRaw<AgentRequest>(
    ViewName.REQUESTS_COUNT_BY_STATUS,
    { group: true, startkey: [workspaceId], endkey: [workspaceId, {}] },
    context.getRequestsDB(),
    createCountByStatusView
  )
  const counts = { active: 0, needs_input: 0, completed: 0, failed: 0 }
  for (const row of response.rows) {
    if (isStatusKey(row.key)) {
      counts[row.key[1]] = Number(row.value)
    }
  }
  return counts
}

const isStatusKey = (key: unknown): key is [string, AgentRequestStatus] =>
  Array.isArray(key) && typeof key[1] === "string" && key[1] in STATUS_RANK
