import { cache, context, db as dbCore } from "@budibase/backend-core"
import type {
  AgentRequest,
  EscalationRaisedAction,
  FetchRequestsResponse,
  FindRequestResponse,
  RequestInboxDoc,
  RequestRow,
  SortOrder,
} from "@budibase/types"
import { getContextDoc } from "../../escalations"
import { getFullUser } from "../../../../utilities/users"
import {
  AGENT_REQUEST_PREFIX,
  buildRequestInboxRows,
  getEscalationState,
  getEscalationExpiry,
  hasResponded,
  isApproverOn,
  matchesFilters,
  getRaisedEscalationIds,
  toRequestRow,
  filterVisibleEscalations,
} from "./inboxRows"
import type { RaisedEscalation, RequestInboxFilters } from "./inboxRows"
import {
  searchRequestInbox,
  withRequestInboxLock,
  writeRows,
} from "./inboxStore"

async function loadRaisedEscalations(
  request: AgentRequest
): Promise<RaisedEscalation[]> {
  const loaded = await Promise.all(
    getRaisedEscalationIds(request).map(async escalationId => ({
      escalationId,
      doc: await getContextDoc(escalationId),
    }))
  )
  return loaded.flatMap(({ escalationId, doc }) =>
    doc ? [{ escalationId, doc }] : []
  )
}

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

  const visibleEscalations = filterVisibleEscalations({
    escalations,
    globalUserId,
    isRequester: userRow.isRequester,
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
    isRequester: userRow.isRequester,
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
