export const MAX_PROMPT_HISTORY_LENGTH = 25

interface PromptHistoryKeyOptions {
  tenantId: string
  userId: string
  workspaceId: string
  agentId: string
}

interface SavePromptHistoryOptions extends PromptHistoryKeyOptions {
  history: string[]
}

export const getPromptHistoryStorageKey = ({
  tenantId,
  userId,
  workspaceId,
  agentId,
}: PromptHistoryKeyOptions) =>
  `budibase:chat-preview-history:${tenantId}:${userId}:${workspaceId}:${agentId}`

export const loadPromptHistory = ({
  tenantId,
  userId,
  workspaceId,
  agentId,
}: PromptHistoryKeyOptions): string[] => {
  if (!tenantId || !userId || !workspaceId || !agentId) {
    return []
  }

  try {
    const storedHistory = sessionStorage.getItem(
      getPromptHistoryStorageKey({ tenantId, userId, workspaceId, agentId })
    )
    if (!storedHistory) {
      return []
    }

    const parsedHistory = JSON.parse(storedHistory)
    if (
      !Array.isArray(parsedHistory) ||
      !parsedHistory.every(prompt => typeof prompt === "string")
    ) {
      return []
    }

    return parsedHistory.slice(-MAX_PROMPT_HISTORY_LENGTH)
  } catch (_error) {
    return []
  }
}

export const savePromptHistory = ({
  tenantId,
  userId,
  workspaceId,
  agentId,
  history,
}: SavePromptHistoryOptions): string[] => {
  const retainedHistory = history.slice(-MAX_PROMPT_HISTORY_LENGTH)
  if (!tenantId || !userId || !workspaceId || !agentId) {
    return retainedHistory
  }

  try {
    sessionStorage.setItem(
      getPromptHistoryStorageKey({ tenantId, userId, workspaceId, agentId }),
      JSON.stringify(retainedHistory)
    )
  } catch (_error) {
    // Keep the in-memory history when browser storage is unavailable.
  }

  return retainedHistory
}
