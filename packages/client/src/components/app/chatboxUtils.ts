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

const parseLockedAgentIdFromPath = (pathname: string) => {
  const normalizedPath = pathname.replace(/\/+$/, "")
  const pathParts = normalizedPath.split("/").filter(Boolean)
  const agentSegmentIndex = pathParts.findIndex(part => part === "agent")
  const rawAgentId =
    agentSegmentIndex >= 0 ? pathParts[agentSegmentIndex + 1] : undefined

  return rawAgentId ? decodeURIComponent(rawAgentId) : undefined
}

export const getLockedAgentIdFromCurrentPath = () => {
  if (typeof window === "undefined") {
    return undefined
  }

  return parseLockedAgentIdFromPath(window.location.pathname)
}

export const isLockedAgentUnavailableError = (
  error: unknown,
  lockedAgentId?: string
) =>
  Boolean(
    lockedAgentId &&
      error instanceof Error &&
      error.message.includes("agentId is not enabled for this chat app")
  )
