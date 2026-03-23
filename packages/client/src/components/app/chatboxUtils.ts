import type { DraftChatConversation, WithoutDocMetadata } from "@budibase/types"

export const createDraftChat = (
  chatAppId = "",
  agentId?: string
): WithoutDocMetadata<DraftChatConversation> => ({
  title: "",
  messages: [],
  chatAppId,
  agentId: agentId || "",
})

export const getLockedAgentIdFromPathname = (pathname: string) => {
  const normalizedPath = pathname.replace(/\/+$/, "")
  const pathParts = normalizedPath.split("/").filter(Boolean)

  if (pathParts[0] !== "app-chat") {
    return undefined
  }

  const agentSegmentIndex = pathParts.findIndex(part => part === "agent")
  const rawAgentId =
    agentSegmentIndex >= 0 ? pathParts[agentSegmentIndex + 1] : undefined

  if (!rawAgentId) {
    return undefined
  }

  try {
    return decodeURIComponent(rawAgentId)
  } catch {
    return undefined
  }
}

export const getLockedAgentIdFromCurrentPath = () => {
  if (typeof window === "undefined") {
    return undefined
  }

  return getLockedAgentIdFromPathname(window.location.pathname)
}

const AGENT_NOT_ENABLED_ERROR = "agentId is not enabled for this chat app"

const isAgentNotEnabledError = (error: Error) =>
  error.message.includes(AGENT_NOT_ENABLED_ERROR)

export const isLockedAgentUnavailableError = (
  error: unknown,
  lockedAgentId?: string
) => {
  if (!lockedAgentId || !(error instanceof Error)) {
    return false
  }

  return isAgentNotEnabledError(error)
}
