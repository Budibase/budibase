import { context, db, ViewName } from "@budibase/backend-core"
import type { AgentRequestStatus } from "@budibase/types"
import type { AgentRequest } from "@budibase/types"
import { DocumentType } from "@budibase/types"

const REQUESTS_BY_AGENT_VIEW = ViewName.AGENT_REQUESTS_BY_AGENT
const REQUESTS_BY_UPDATED_AT_VIEW = ViewName.AGENT_REQUESTS_BY_UPDATED_AT
const REQUESTS_BY_STATUS_AND_UPDATED_AT_VIEW =
  ViewName.AGENT_REQUESTS_BY_STATUS_AND_UPDATED_AT

const buildRequestsByAgentView = (): string => `function(doc) {
  if (doc._id && doc._id.startsWith("${DocumentType.AGENT_REQUEST}_") && doc.agentId) {
    emit(doc.agentId, null)
  }
}`

const buildRequestsByUpdatedAtView = (): string => `function(doc) {
  if (doc._id && doc._id.startsWith("${DocumentType.AGENT_REQUEST}_") && (doc.updatedAt || doc.createdAt)) {
    emit(doc.updatedAt || doc.createdAt, doc.status)
  }
}`

const buildRequestsByStatusAndUpdatedAtView = (): string => `function(doc) {
  if (doc._id && doc._id.startsWith("${DocumentType.AGENT_REQUEST}_") && doc.status && (doc.updatedAt || doc.createdAt)) {
    emit([doc.status, doc.updatedAt || doc.createdAt], null)
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

export const createRequestsByStatusAndUpdatedAtView = async () => {
  await db.createView(
    context.getProdWorkspaceDB(),
    buildRequestsByStatusAndUpdatedAtView(),
    REQUESTS_BY_STATUS_AND_UPDATED_AT_VIEW
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

export const queryRequestsByStatusAndUpdatedAt = async ({
  status,
  limit,
  page,
}: {
  status: AgentRequestStatus
  limit: number
  page: number
}): Promise<AgentRequest[]> => {
  return (await db.queryView<AgentRequest>(
    REQUESTS_BY_STATUS_AND_UPDATED_AT_VIEW,
    {
      include_docs: true,
      descending: true,
      startkey: [status, {}],
      endkey: [status],
      limit,
      skip: (page - 1) * limit,
    },
    context.getProdWorkspaceDB(),
    createRequestsByStatusAndUpdatedAtView,
    { arrayResponse: true }
  )) as AgentRequest[]
}

export const queryRequestStatuses = async (): Promise<AgentRequestStatus[]> => {
  return (await db.queryView<AgentRequest>(
    REQUESTS_BY_UPDATED_AT_VIEW,
    {
      include_docs: false,
    },
    context.getProdWorkspaceDB(),
    createRequestsByUpdatedAtView,
    { arrayResponse: true }
  )) as unknown as AgentRequestStatus[]
}
