import { context, docIds } from "@budibase/backend-core"
import type { AgentRequest } from "@budibase/types"
import { DocumentType } from "@budibase/types"
import { shouldCreateNewAgentRequest } from "./helpers"

const buildAgentRequest = ({
  _id,
  _rev,
  agentId,
  chatConversationId,
  userId,
  promptHistory,
  interactionCount,
  status,
  createdAt,
}: {
  _id: string
  _rev?: string
  agentId: string
  chatConversationId: string
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
    chatConversationId,
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

export async function fetchByConversation(
  agentId: string,
  chatConversationId: string
): Promise<AgentRequest[]> {
  const db = context.getWorkspaceDB()
  const prefix = docIds.getAgentRequestPrefix(agentId, chatConversationId)
  const response = await db.allDocs<AgentRequest>({
    startkey: prefix,
    endkey: `${prefix}\ufff0`,
    include_docs: true,
  })

  return response.rows
    .map(row => row.doc)
    .filter((doc): doc is AgentRequest => !!doc)
}

export async function fetchLatestByConversation(
  agentId: string,
  chatConversationId: string
): Promise<AgentRequest | undefined> {
  const db = context.getWorkspaceDB()
  const prefix = docIds.getAgentRequestPrefix(agentId, chatConversationId)
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

export async function startRequest({
  agentId,
  chatConversationId,
  latestPrompt,
  userId,
}: {
  agentId: string
  chatConversationId: string
  latestPrompt: string
  userId: string
}): Promise<AgentRequest | undefined> {
  const prompt = latestPrompt.trim()
  if (!prompt) {
    return undefined
  }

  const currentRequest = await fetchLatestByConversation(agentId, chatConversationId)
  const shouldCreateNew = shouldCreateNewAgentRequest({
    latestPrompt: prompt,
    currentRequest,
  })

  if (!currentRequest || shouldCreateNew) {
    return await save(
      buildAgentRequest({
        _id: docIds.generateAgentRequestID(agentId, chatConversationId),
        agentId,
        chatConversationId,
        userId,
        promptHistory: [prompt],
        interactionCount: 1,
        status: "waiting",
      })
    )
  }

  return await save(
    buildAgentRequest({
      _id: currentRequest._id!,
      _rev: currentRequest._rev,
      agentId: currentRequest.agentId,
      chatConversationId: currentRequest.chatConversationId,
      userId: currentRequest.userId,
      promptHistory: [...currentRequest.promptHistory, prompt],
      interactionCount: currentRequest.interactionCount + 1,
      status: "waiting",
      createdAt: currentRequest.createdAt,
    })
  )
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
