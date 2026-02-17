interface ModelOption {
  value: string
}

interface ShouldAutoSelectAgentModelParams {
  modelOptions: ModelOption[]
  agentAiconfig?: string
  draftAiconfig?: string
}

export const shouldAutoSelectAgentModel = ({
  modelOptions,
  agentAiconfig,
  draftAiconfig,
}: ShouldAutoSelectAgentModelParams) => {
  if (modelOptions.length === 0) {
    return false
  }

  const agentHasAiconfig = agentAiconfig != null && agentAiconfig !== ""
  const draftValue = draftAiconfig || ""

  return !agentHasAiconfig && !draftValue
}
