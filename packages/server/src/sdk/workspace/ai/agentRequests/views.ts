import { context, createView } from "@budibase/backend-core"
import type { AgentRequest } from "@budibase/types"
import { DocumentType } from "@budibase/types"

const REQUESTS_BY_AGENT_VIEW = "agent_requests_by_agent"
const REQUESTS_BY_UPDATED_AT_VIEW = "agent_requests_by_updated_at"

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

export const createRequestsByAgentView = async () => {
  await createView(
    context.getProdWorkspaceDB(),
    buildRequestsByAgentView(),
    REQUESTS_BY_AGENT_VIEW
  )
}

export const createRequestsByUpdatedAtView = async () => {
  await createView(
    context.getProdWorkspaceDB(),
    buildRequestsByUpdatedAtView(),
    REQUESTS_BY_UPDATED_AT_VIEW
  )
}

export const queryRequestsByAgent = async (
  agentId: string
): Promise<AgentRequest[]> => {
  const db = context.getProdWorkspaceDB()

  try {
    const response = await db.query<AgentRequest>(
      `database/${REQUESTS_BY_AGENT_VIEW}`,
      {
        include_docs: true,
        key: agentId,
      }
    )

    return response.rows
      .map(row => row.doc)
      .filter((doc): doc is AgentRequest => !!doc)
  } catch (err: any) {
    if (err?.error === "not_found" && err?.reason === "missing_named_view") {
      await createRequestsByAgentView()
      return queryRequestsByAgent(agentId)
    }

    throw err
  }
}

export const queryRequestsByUpdatedAt = async ({
  limit,
  page,
}: {
  limit: number
  page: number
}): Promise<AgentRequest[]> => {
  const db = context.getProdWorkspaceDB()

  try {
    const response = await db.query<AgentRequest>(
      `database/${REQUESTS_BY_UPDATED_AT_VIEW}`,
      {
        include_docs: true,
        descending: true,
        limit,
        skip: (page - 1) * limit,
      }
    )

    return response.rows
      .map(row => row.doc)
      .filter((doc): doc is AgentRequest => !!doc)
  } catch (err: any) {
    if (err?.error === "not_found" && err?.reason === "missing_named_view") {
      await createRequestsByUpdatedAtView()
      return queryRequestsByUpdatedAt({ limit, page })
    }

    throw err
  }
}
