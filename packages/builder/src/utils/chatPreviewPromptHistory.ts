export const MAX_PROMPT_HISTORY_LENGTH = 25

interface PromptHistoryKeyOptions {
  workspaceId: string
  agentId: string
}

interface SavePromptHistoryOptions extends PromptHistoryKeyOptions {
  history: string[]
}

export const getPromptHistoryStorageKey = ({
  workspaceId,
  agentId,
}: PromptHistoryKeyOptions) =>
  `budibase:chat-preview-history:${workspaceId}:${agentId}`

export const loadPromptHistory = ({
  workspaceId,
  agentId,
}: PromptHistoryKeyOptions): string[] => {
  if (!workspaceId || !agentId) {
    return []
  }

  try {
    const storedHistory = localStorage.getItem(
      getPromptHistoryStorageKey({ workspaceId, agentId })
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
  workspaceId,
  agentId,
  history,
}: SavePromptHistoryOptions): string[] => {
  const retainedHistory = history.slice(-MAX_PROMPT_HISTORY_LENGTH)
  if (!workspaceId || !agentId) {
    return retainedHistory
  }

  try {
    localStorage.setItem(
      getPromptHistoryStorageKey({ workspaceId, agentId }),
      JSON.stringify(retainedHistory)
    )
  } catch (_error) {
    // Keep the in-memory history when browser storage is unavailable.
  }

  return retainedHistory
}
