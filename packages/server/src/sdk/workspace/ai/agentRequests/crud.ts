import { context, docIds } from "@budibase/backend-core"
import type { AgentRequest } from "@budibase/types"
import { DocumentType } from "@budibase/types"
import { analyzeAgentRequestBoundary } from "./helpers"

const buildAgentRequest = ({
  _id,
  _rev,
  agentId,
  sessionId,
  userId,
  promptHistory,
  interactionCount,
  status,
  createdAt,
}: {
  _id: string
  _rev?: string
  agentId: string
  sessionId: string
  userId: string
  promptHistory: string[]
  interactionCount: number
  status: AgentRequest["status"]
  createdAt?: string | number
}): AgentRequest => {
  const now = new Date().toISOString()

  return {
    _id,
    ...(_rev ? { _rev } : {}),
    agentId,
    sessionId,
    userId,
    promptHistory,
    interactionCount,
    status,
    createdAt: createdAt || now,
    updatedAt: now,
  }
}

export async function fetch(agentRequestId: string): Promise<AgentRequest | undefined> {
  return await context.getWorkspaceDB().tryGet<AgentRequest>(agentRequestId)
}

export async function fetchBySession(
  agentId: string,
  sessionId: string
): Promise<AgentRequest[]> {
  const db = context.getWorkspaceDB()
  const prefix = docIds.getAgentRequestPrefix(agentId, sessionId)
  const response = await db.allDocs<AgentRequest>({
    startkey: prefix,
    endkey: `${prefix}\ufff0`,
    include_docs: true,
  })

  return response.rows
    .map(row => row.doc)
    .filter((doc): doc is AgentRequest => !!doc)
}

export async function fetchLatestBySession(
  agentId: string,
  sessionId: string
): Promise<AgentRequest | undefined> {
  const db = context.getWorkspaceDB()
  const prefix = docIds.getAgentRequestPrefix(agentId, sessionId)
  const response = await db.allDocs<AgentRequest>({
    startkey: `${prefix}\ufff0`,
    endkey: prefix,
    descending: true,
    limit: 1,
    include_docs: true,
  })

  return response.rows[0]?.doc || undefined
}

export async function save(request: AgentRequest): Promise<AgentRequest> {
  const response = await context.getWorkspaceDB().put(request)
  return {
    ...request,
    _rev: response.rev,
  }
}

export async function createRequest({
  agentId,
  sessionId,
  latestPrompt,
  userId,
}: {
  agentId: string
  sessionId: string
  latestPrompt: string
  userId: string
}): Promise<AgentRequest | undefined> {
  const prompt = latestPrompt.trim()
  if (!prompt) {
    return undefined
  }

  return await save(
    buildAgentRequest({
      _id: docIds.generateAgentRequestID(agentId, sessionId),
      agentId,
      sessionId,
      userId,
      promptHistory: [prompt],
      interactionCount: 1,
      status: "waiting",
    })
  )
}

export async function appendToRequest({
  request,
  latestPrompt,
}: {
  request: AgentRequest
  latestPrompt: string
}): Promise<AgentRequest | undefined> {
  const prompt = latestPrompt.trim()
  if (!prompt) {
    return request
  }

  return await save(
    buildAgentRequest({
      _id: request._id!,
      _rev: request._rev,
      agentId: request.agentId,
      sessionId: request.sessionId,
      userId: request.userId,
      promptHistory: [...request.promptHistory, prompt],
      interactionCount: request.interactionCount + 1,
      status: "waiting",
      createdAt: request.createdAt,
    })
  )
}

export async function createOrUpdateRequestForPrompt({
  agentId,
  sessionId,
  latestPrompt,
  userId,
}: {
  agentId: string
  sessionId: string
  latestPrompt: string
  userId: string
}): Promise<AgentRequest | undefined> {
  const currentRequest = await fetchLatestBySession(agentId, sessionId)
  const requestBoundary = await analyzeAgentRequestBoundary({
    latestPrompt,
    currentRequest,
    agentId,
    sessionId,
  })

  if (requestBoundary.decision === "new_request" || !currentRequest) {
    return await createRequest({
      agentId,
      sessionId,
      latestPrompt,
      userId,
    })
  }

  return await appendToRequest({
    request: currentRequest,
    latestPrompt,
  })
}

export async function markCompleted(
  agentRequestId: string
): Promise<AgentRequest | undefined> {
  const existing = await fetch(agentRequestId)
  if (!existing) {
    return undefined
  }

  if (existing.status === "completed") {
    return existing
  }

  return await save({
    ...existing,
    status: "completed",
    updatedAt: new Date().toISOString(),
  })
}

export async function fetchByAgent(agentId: string): Promise<AgentRequest[]> {
  const db = context.getWorkspaceDB()
  const response = await db.allDocs<AgentRequest>({
    ...docIds.getDocParams(DocumentType.AGENT_REQUEST, undefined, {
      include_docs: true,
    }),
  })

  return response.rows
    .map(row => row.doc)
    .filter(
      (doc): doc is AgentRequest => !!doc && doc.agentId === agentId
    )
}
