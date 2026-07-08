import { context, db, ViewName } from "@budibase/backend-core"
import type { AgentRequest } from "@budibase/types"
import { DocumentType } from "@budibase/types"

const REQUESTS_BY_AGENT_VIEW = ViewName.AGENT_REQUESTS_BY_AGENT
const REQUESTS_BY_UPDATED_AT_VIEW = ViewName.AGENT_REQUESTS_BY_UPDATED_AT
const REQUESTS_BY_SESSION_VIEW = ViewName.AGENT_REQUESTS_BY_SESSION

const buildRequestsByAgentView = (): string => `function(doc) {
  if (doc._id && doc._id.startsWith("${DocumentType.AGENT_REQUEST}_") && doc.agentId) {
    emit(doc.agentId, null)
  }
}`

const buildRequestsByUpdatedAtView = (): string => `function(doc) {
  if (doc._id && doc._id.startsWith("${DocumentType.AGENT_REQUEST}_") && (doc.updatedAt || doc.createdAt)) {
    emit(doc.updatedAt || doc.createdAt, null)
  }
}`

const buildRequestsBySessionView = (): string => `function(doc) {
  if (doc._id && doc._id.startsWith("${DocumentType.AGENT_REQUEST}_") && doc.agentId && doc.entries) {
    for (var i = 0; i < doc.entries.length; i++) {
      if (doc.entries[i].sessionId) {
        emit([doc.agentId, doc.entries[i].sessionId], null)
      }
    }
  }
}`

export const createRequestsByAgentView = async () => {
  await db.createView(
    context.getProdWorkspaceDB(),
    buildRequestsByAgentView(),
    REQUESTS_BY_AGENT_VIEW
  )
}

export const createRequestsByUpdatedAtView = async () => {
  await db.createView(
    context.getProdWorkspaceDB(),
    buildRequestsByUpdatedAtView(),
    REQUESTS_BY_UPDATED_AT_VIEW
  )
}

export const createRequestsBySessionView = async () => {
  await db.createView(
    context.getProdWorkspaceDB(),
    buildRequestsBySessionView(),
    REQUESTS_BY_SESSION_VIEW
  )
}

export const queryRequestsByAgent = async (
  agentId: string
): Promise<AgentRequest[]> => {
  return (await db.queryView<AgentRequest>(
    REQUESTS_BY_AGENT_VIEW,
    {
      include_docs: true,
      key: agentId,
    },
    context.getProdWorkspaceDB(),
    createRequestsByAgentView,
    { arrayResponse: true }
  )) as AgentRequest[]
}

export const queryRequestsBySession = async (
  agentId: string,
  sessionId: string
): Promise<AgentRequest[]> => {
  return (await db.queryView<AgentRequest>(
    REQUESTS_BY_SESSION_VIEW,
    {
      include_docs: true,
      key: [agentId, sessionId],
    },
    context.getProdWorkspaceDB(),
    createRequestsBySessionView,
    { arrayResponse: true }
  )) as AgentRequest[]
}

export const queryRequestsByUpdatedAt = async ({
  limit,
  page,
}: {
  limit: number
  page: number
}): Promise<AgentRequest[]> => {
  return (await db.queryView<AgentRequest>(
    REQUESTS_BY_UPDATED_AT_VIEW,
    {
      include_docs: true,
      descending: true,
      limit,
      skip: (page - 1) * limit,
    },
    context.getProdWorkspaceDB(),
    createRequestsByUpdatedAtView,
    { arrayResponse: true }
  )) as AgentRequest[]
}
