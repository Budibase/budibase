import { DocumentType, REQUEST_INBOX_TYPE, SEPARATOR } from "@budibase/types"
import type {
  AgentRequest,
  EscalationContextDoc,
  RequestEscalationState,
  RequestInboxDoc,
  RequestRow,
} from "@budibase/types"

export const AGENT_REQUEST_PREFIX = `${DocumentType.AGENT_REQUEST}${SEPARATOR}`

export const FILTER_FIELDS = [
  "isRequester",
  "isApprover",
  "awaitingResponse",
  "respondedPending",
  "status",
  "workspaceId",
  "agentId",
  "operationId",
] as const

export type RequestInboxFilters = Partial<
  Pick<RequestInboxDoc, (typeof FILTER_FIELDS)[number]>
>

export interface RaisedEscalation {
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

export const workspaceRowPrefix = (workspaceId: string) =>
  [DocumentType.REQUEST_INBOX, workspaceId, ""].join(SEPARATOR)

const rowId = ({
  workspaceId,
  requestId,
  globalUserId,
}: {
  workspaceId: string
  requestId: string
  globalUserId: string
}) =>
  `${workspaceRowPrefix(workspaceId)}${requestId.slice(AGENT_REQUEST_PREFIX.length)}${SEPARATOR}${globalUserId}`

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
      const expiresAt = getEscalationExpiry(doc)
      if (doc.resolution === "pending" && expiresAt) {
        requester.expiries.push(expiresAt)
      }
    }
  }
  for (const { doc } of escalations) {
    const expiresAt = getEscalationExpiry(doc)
    for (const approverId of doc.policy?.approvers ?? []) {
      const approver = involvementOf(approverId)
      approver.isApprover = true
      if (doc.resolution !== "pending") {
        continue
      }
      if (hasResponded(doc, approverId)) {
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

export const matchesFilters = (
  row: RequestInboxDoc,
  filters: RequestInboxFilters
) =>
  FILTER_FIELDS.every(
    field => filters[field] === undefined || row[field] === filters[field]
  )

export const toRequestRow = (row: RequestInboxDoc): RequestRow => ({
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
