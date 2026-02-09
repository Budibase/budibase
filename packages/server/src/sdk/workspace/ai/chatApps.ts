import { context, docIds, HTTPError } from "@budibase/backend-core"
import { ChatApp, DocumentType } from "@budibase/types"

const withDefaults = (chatApp: ChatApp): ChatApp => ({
  ...chatApp,
  live: chatApp.live ?? false,
  agents: chatApp.agents ?? [],
})

const normalizeConversationStarters = (
  starters?: ChatApp["agents"][number]["conversationStarters"]
) => {
  if (starters === undefined) {
    return undefined
  }
  if (!Array.isArray(starters)) {
    throw new HTTPError("conversationStarters must contain prompt entries", 400)
  }
  if (starters.length > 3) {
    throw new HTTPError(
      "conversationStarters may contain at most 3 starters",
      400
    )
  }

  return starters.map(starter => {
    if (!starter || typeof starter !== "object") {
      throw new HTTPError(
        "conversationStarters must contain prompt entries",
        400
      )
    }
    if (typeof starter.prompt !== "string") {
      throw new HTTPError(
        "conversationStarters must contain prompt entries",
        400
      )
    }
    return { prompt: starter.prompt }
  })
}

const normalizeAgents = (agents?: ChatApp["agents"]) => {
  if (agents === undefined) {
    return undefined
  }
  if (!Array.isArray(agents)) {
    throw new HTTPError("agents must contain valid agentId entries", 400)
  }
  if (agents.length === 0) {
    return []
  }

  const allValid = agents.every(
    agent => typeof agent?.agentId === "string" && agent.agentId.trim().length
  )

  if (!allValid) {
    throw new HTTPError("agents must contain valid agentId entries", 400)
  }

  return agents.map(agent => ({
    agentId: agent.agentId,
    isEnabled: agent.isEnabled === true,
    isDefault: agent.isDefault === true,
    conversationStarters: normalizeConversationStarters(
      agent.conversationStarters
    ),
  }))
}

export async function getSingle(): Promise<ChatApp | undefined> {
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<ChatApp>(
    docIds.getDocParams(DocumentType.CHAT_APP, undefined, {
      include_docs: true,
      limit: 1,
    })
  )
  const chatApp = result.rows[0]?.doc
  return chatApp ? withDefaults(chatApp) : undefined
}

export async function getOrThrow(id: string | undefined) {
  if (!id) {
    throw new HTTPError("chatAppId is required", 400)
  }
  const db = context.getWorkspaceDB()
  const chatApp = await db.tryGet<ChatApp>(id)
  if (!chatApp) {
    throw new HTTPError("Chat App not found", 404)
  }
  return withDefaults(chatApp)
}

export async function create(chatApp: Omit<ChatApp, "_id" | "_rev">) {
  const db = context.getWorkspaceDB()
  const existing = await getSingle()
  if (existing) {
    throw new HTTPError("Chat App already exists for this workspace", 400)
  }
  const normalizedAgents = normalizeAgents(
    chatApp.agents === undefined ? undefined : chatApp.agents
  )
  const now = new Date().toISOString()
  const doc: ChatApp = {
    _id: docIds.generateChatAppID(),
    createdAt: now,
    updatedAt: now,
    ...chatApp,
    agents: normalizedAgents ?? [],
  }

  const { rev } = await db.put(doc)
  return { ...doc, _rev: rev }
}

export async function update(chatApp: ChatApp) {
  if (!chatApp._id || !chatApp._rev) {
    throw new HTTPError("_id and _rev are required", 400)
  }
  const db = context.getWorkspaceDB()
  const existing = await db.tryGet<ChatApp>(chatApp._id)
  if (!existing) {
    throw new HTTPError("Chat App not found", 404)
  }
  const normalizedAgents = normalizeAgents(
    chatApp.agents === undefined ? (existing.agents ?? []) : chatApp.agents
  )
  const now = new Date().toISOString()
  const updated: ChatApp = {
    ...existing,
    ...chatApp,
    agents: normalizedAgents ?? [],
    updatedAt: now,
  }
  const { rev } = await db.put(updated)
  updated._rev = rev
  return withDefaults(updated)
}
