import type { AgentMessageMetadata } from "@budibase/types"
import type { UIMessage } from "ai"

const STORAGE_PREFIX = "budibase:chat-preview"

interface ChatPreviewSessionKey {
  tenantId: string
  userId: string
  workspaceId: string
  agentId: string
}

interface ChatPreviewSession {
  messages: UIMessage<AgentMessageMetadata>[]
  previewRoleId: string
}

interface SaveChatPreviewSessionOptions extends ChatPreviewSessionKey {
  session: ChatPreviewSession
}

export const getChatPreviewSessionKey = ({
  tenantId,
  userId,
  workspaceId,
  agentId,
}: ChatPreviewSessionKey) =>
  `${STORAGE_PREFIX}:${tenantId}:${userId}:${workspaceId}:${agentId}`

const isChatPreviewSession = (value: unknown): value is ChatPreviewSession => {
  if (!value || typeof value !== "object") {
    return false
  }

  const session = value as Partial<ChatPreviewSession>
  return (
    typeof session.previewRoleId === "string" &&
    Array.isArray(session.messages) &&
    session.messages.every(
      message =>
        !!message &&
        typeof message === "object" &&
        typeof message.id === "string" &&
        !!message.id &&
        typeof message.role === "string" &&
        Array.isArray(message.parts)
    ) &&
    new Set(session.messages.map(message => message.id)).size ===
      session.messages.length
  )
}

export const loadChatPreviewSession = (
  options: ChatPreviewSessionKey
): ChatPreviewSession | undefined => {
  if (Object.values(options).some(value => !value)) {
    return undefined
  }

  try {
    const stored = sessionStorage.getItem(getChatPreviewSessionKey(options))
    if (!stored) {
      return undefined
    }

    const parsed = JSON.parse(stored)
    return isChatPreviewSession(parsed) ? parsed : undefined
  } catch (_error) {
    return undefined
  }
}

export const saveChatPreviewSession = ({
  session,
  ...key
}: SaveChatPreviewSessionOptions) => {
  if (Object.values(key).some(value => !value)) {
    return
  }

  const storageKey = getChatPreviewSessionKey(key)
  const persisted: ChatPreviewSession = {
    previewRoleId: session.previewRoleId,
    messages: [...session.messages],
  }

  while (true) {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(persisted))
      return
    } catch (_error) {
      if (persisted.messages.length === 0) {
        try {
          sessionStorage.removeItem(storageKey)
        } catch (_clearError) {
          // Keep the in-memory conversation when browser storage is unavailable.
        }
        return
      }

      persisted.messages = persisted.messages.slice(1)
    }
  }
}

export const clearChatPreviewSession = (options: ChatPreviewSessionKey) => {
  if (Object.values(options).some(value => !value)) {
    return
  }

  try {
    sessionStorage.removeItem(getChatPreviewSessionKey(options))
  } catch (_error) {
    // The in-memory conversation is still cleared by the caller.
  }
}
