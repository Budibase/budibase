import type { AgentOperation } from "@budibase/types"

export const hasUnsavedOperationInstructions = ({
  promptInstructions,
  lastSavedInstructions,
}: {
  promptInstructions?: string | null
  lastSavedInstructions: string
}) => (promptInstructions || "") !== lastSavedInstructions

export const shouldResyncOperationFromStore = ({
  agentRev,
  syncedAgentRev,
  isSaving,
}: {
  agentRev?: string
  syncedAgentRev?: string
  isSaving: boolean
}) => {
  if (!agentRev || agentRev === syncedAgentRev) {
    return false
  }
  if (isSaving) {
    return false
  }
  return true
}

export const mergeResyncedOperation = ({
  storeOperation,
  localOperation,
  preserveInstructionEdits,
}: {
  storeOperation: AgentOperation
  localOperation: AgentOperation
  preserveInstructionEdits: boolean
}): AgentOperation => {
  if (!preserveInstructionEdits) {
    return { ...storeOperation }
  }

  return {
    ...storeOperation,
    promptInstructions: localOperation.promptInstructions,
    enabledTools: localOperation.enabledTools,
  }
}
