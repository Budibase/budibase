import { cache, context, db as dbCore } from "@budibase/backend-core"
import { DocumentType, SEPARATOR, SortOrder } from "@budibase/types"
import type {
  AgentRequest,
  EscalationRaisedAction,
  FetchRequestsResponse,
  FindRequestResponse,
  SearchFilters,
} from "@budibase/types"
import { getFullUser } from "../../../../utilities/users"
import {
  EQUAL_FILTER_FIELDS,
  filterVisibleEscalations,
  getEscalationExpiry,
  getEscalationState,
  getUserFlags,
  hasResponded,
  isApproverOn,
  isInvolved,
  loadRaisedEscalations,
  searchRequests,
  toRequestRow,
} from "./requestsStore"
import type { RaisedEscalation, RequestInboxFilters } from "./requestsStore"
import { queryRequestIdsByUser } from "./views"

const USER_VIEW_ID_LIMIT = 5000

async function loadEscalationsWithIds(
  request: AgentRequest
): Promise<RaisedEscalation[]> {
  const docs = await loadRaisedEscalations(request)
  return docs.flatMap(doc =>
    doc._id
      ? [{ escalationId: doc._id.split("_").slice(2).join("_"), doc }]
      : []
  )
}

async function getWorkspaceName(workspaceId: string) {
  const metadata = await cache.workspace.getWorkspaceMetadata(workspaceId)
  return "name" in metadata ? metadata.name : undefined
}

const USER_ARRAY_FOR_FILTER = {
  isApprover: "approvers",
  awaitingMe: "pendingApprovers",
  responded: "respondedApprovers",
} as const

function buildUserFilters(
  globalUserId: string,
  filters: RequestInboxFilters,
  requestIds?: string[]
): SearchFilters {
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
    ;(filters.isRequester ? equal : notEqual).userId = globalUserId
  }
  for (const [field, column] of Object.entries(USER_ARRAY_FOR_FILTER)) {
    const value = filters[field as keyof typeof USER_ARRAY_FOR_FILTER]
    if (value !== undefined) {
      ;(value ? contains : notContains)[column] = [globalUserId]
    }
  }
  const involvement: SearchFilters = requestIds
    ? { oneOf: { _id: requestIds } }
    : {
        $or: {
          conditions: [
            { equal: { userId: globalUserId } },
            { contains: { approvers: [globalUserId] } },
          ],
        },
      }
  const conditions: SearchFilters[] = [
    involvement,
    { equal, notEqual, contains, notContains },
  ]
  if (filters.awaitingOthers === true) {
    conditions.push({
      equal: { status: "needs_input" },
      notContains: { pendingApprovers: [globalUserId] },
    })
  } else if (filters.awaitingOthers === false) {
    conditions.push({
      $or: {
        conditions: [
          { notEqual: { status: "needs_input" } },
          { contains: { pendingApprovers: [globalUserId] } },
        ],
      },
    })
  }
  return { $and: { conditions } }
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
  const requestIds = await queryRequestIdsByUser(globalUserId)
  if (!requestIds.length) {
    return { requests: [], page, hasNextPage: false }
  }
  const { requests, hasNextPage } = await searchRequests({
    filters: buildUserFilters(
      globalUserId,
      filters,
      requestIds.length <= USER_VIEW_ID_LIMIT ? requestIds : undefined
    ),
    sort: [
      {
        field: "pendingApprovers",
        containsValue: globalUserId,
        direction: SortOrder.DESCENDING,
      },
      { field: "statusRank", direction: SortOrder.ASCENDING },
      { field: "createdAt", direction: order },
    ],
    page,
    limit,
  })
  return {
    requests: requests.map(request => toRequestRow(request, globalUserId)),
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
  if (
    !currentWorkspaceId ||
    !requestId.startsWith(`${DocumentType.REQUEST}${SEPARATOR}`)
  ) {
    return undefined
  }
  const workspaceId = dbCore.getProdWorkspaceID(currentWorkspaceId)
  const request = await context.getRequestsDB().tryGet<AgentRequest>(requestId)
  if (
    !request ||
    request.workspaceId !== workspaceId ||
    !isInvolved(request, globalUserId)
  ) {
    return undefined
  }
  const { isRequester } = getUserFlags(request, globalUserId)
  const escalations = await loadEscalationsWithIds(request)

  const visibleEscalations = filterVisibleEscalations({
    escalations,
    globalUserId,
    isRequester,
  })
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
    isRequester,
    escalations: visibleEscalations.map(({ escalationId, doc }) => ({
      escalationId,
      title: doc.title,
      operationId: doc.operationId,
      recipients: recipientsByEscalation.get(escalationId) ?? [],
      state: getEscalationState(doc),
      expiresAt: getEscalationExpiry(doc),
      isApprover: isApproverOn(doc, globalUserId),
      responded: hasResponded(doc, globalUserId),
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
