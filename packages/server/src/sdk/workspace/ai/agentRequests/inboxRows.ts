import { DocumentType, REQUEST_INBOX_TYPE, SEPARATOR } from "@budibase/types"
import type {
  AgentRequest,
  EscalationContextDoc,
  RequestEscalationState,
  RequestInboxDoc,
  RequestRow,
} from "@budibase/types"

export const AGENT_REQUEST_PREFIX = `${DocumentType.AGENT_REQUEST}${SEPARATOR}`

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

export const workspaceRowPrefix = (workspaceId: string) =>
  [DocumentType.REQUEST_INBOX, workspaceId, ""].join(SEPARATOR)

const docId = (workspaceId: string, requestId: string) =>
  `${workspaceRowPrefix(workspaceId)}${requestId.slice(AGENT_REQUEST_PREFIX.length)}`

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

export function buildRequestInboxDoc({
  request,
  escalations,
  workspaceId,
}: {
  request: AgentRequest
  escalations: RaisedEscalation[]
  workspaceId: string
}): RequestInboxDoc | undefined {
  if (!request._id) {
    return undefined
  }
  const approvers = new Set<string>()
  const pendingApprovers = new Set<string>()
  const respondedApprovers = new Set<string>()
  const expiries: string[] = []

  for (const { doc } of escalations) {
    const pending = doc.resolution === "pending"
    const expiresAt = getEscalationExpiry(doc)
    if (pending && expiresAt) {
      expiries.push(expiresAt)
    }
    for (const approverId of doc.policy?.approvers ?? []) {
      approvers.add(approverId)
      if (hasResponded(doc, approverId)) {
        respondedApprovers.add(approverId)
      } else if (pending) {
        pendingApprovers.add(approverId)
      }
    }
  }

  return {
    _id: docId(workspaceId, request._id),
    type: REQUEST_INBOX_TYPE,
    workspaceId,
    requestId: request._id,
    title: request.title,
    agentId: request.agentId,
    operationId: request.operationId,
    status: request.status,
    needsInput: request.status === "needs_input",
    createdAt: request.createdAt,
    requester: request.userId,
    approvers: [...approvers],
    pendingApprovers: [...pendingApprovers],
    respondedApprovers: [...respondedApprovers],
    expiresAt: expiries.sort()[0],
  }
}

export const getUserFlags = (doc: RequestInboxDoc, globalUserId: string) => ({
  isRequester: doc.requester === globalUserId,
  isApprover: doc.approvers.includes(globalUserId),
  awaitingMe: doc.pendingApprovers.includes(globalUserId),
  awaitingOthers:
    doc.pendingApprovers.length > 0 &&
    !doc.pendingApprovers.includes(globalUserId),
  responded: doc.respondedApprovers.includes(globalUserId),
})

export const isInvolved = (doc: RequestInboxDoc, globalUserId: string) =>
  doc.requester === globalUserId || doc.approvers.includes(globalUserId)

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
  doc: RequestInboxDoc,
  filters: RequestInboxFilters,
  globalUserId: string
) => {
  const flags = getUserFlags(doc, globalUserId)
  return (
    USER_FILTER_FIELDS.every(
      field => filters[field] === undefined || flags[field] === filters[field]
    ) &&
    EQUAL_FILTER_FIELDS.every(
      field => filters[field] === undefined || doc[field] === filters[field]
    )
  )
}

export const toRequestRow = (
  doc: RequestInboxDoc,
  globalUserId: string
): RequestRow => ({
  requestId: doc.requestId,
  workspaceId: doc.workspaceId,
  title: doc.title,
  agentId: doc.agentId,
  operationId: doc.operationId,
  status: doc.status,
  ...getUserFlags(doc, globalUserId),
  expiresAt: doc.expiresAt,
  createdAt: doc.createdAt,
})
