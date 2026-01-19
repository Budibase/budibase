import { context, docIds, HTTPError } from "@budibase/backend-core"
import { ChatApp, DocumentType } from "@budibase/types"

const withDefaults = (chatApp: ChatApp): ChatApp => ({
  ...chatApp,
  live: chatApp.live ?? false,
})

const normalizeEnabledAgents = (enabledAgents?: ChatApp["enabledAgents"]) => {
  if (enabledAgents === undefined) {
    return undefined
  }
  if (!Array.isArray(enabledAgents)) {
    throw new HTTPError("enabledAgents must contain valid agentId entries", 400)
  }
  if (enabledAgents.length === 0) {
    return []
  }

  const allValid = enabledAgents.every(
    agent => typeof agent?.agentId === "string" && agent.agentId.trim().length
  )

  if (!allValid) {
    throw new HTTPError("enabledAgents must contain valid agentId entries", 400)
  }

  const defaultCount = enabledAgents.filter(agent => agent.default).length
  if (defaultCount > 1) {
    throw new HTTPError("enabledAgents must contain at most one default", 400)
  }

  if (defaultCount === 0) {
    return enabledAgents.map((agent, index) => ({
      ...agent,
      default: index === 0,
    }))
  }

  return enabledAgents.map(agent => ({
    ...agent,
    default: agent.default === true,
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
  const normalizedEnabledAgents = normalizeEnabledAgents(
    chatApp.enabledAgents === undefined ? undefined : chatApp.enabledAgents
  )

  const now = new Date().toISOString()
  const doc: ChatApp = {
    _id: docIds.generateChatAppID(),
    createdAt: now,
    updatedAt: now,
    ...chatApp,
    enabledAgents: normalizedEnabledAgents ?? [],
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
  const normalizedEnabledAgents = normalizeEnabledAgents(
    chatApp.enabledAgents === undefined
      ? (existing.enabledAgents ?? [])
      : chatApp.enabledAgents
  )

  const now = new Date().toISOString()
  const updated: ChatApp = {
    ...existing,
    ...chatApp,
    enabledAgents: normalizedEnabledAgents ?? [],
    updatedAt: now,
  }
  const { rev } = await db.put(updated)
  updated._rev = rev
  return withDefaults(updated)
}
