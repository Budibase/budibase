import type { EnrichedBinding } from "@budibase/types"
import type { BindingCompletionOption } from "@/types"
import {
  bindingsToCompletions,
  EditorModes,
} from "@/components/common/CodeEditor"

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

  return !agentAiconfig && !draftAiconfig
}

interface BuildAgentPromptCompletionOptionsParams {
  promptBindings: EnrichedBinding[]
  webSearchBinding?: EnrichedBinding
  webSearchConfigured: boolean
  onConfigureWebSearch: () => void
}

export const buildAgentPromptCompletionOptions = ({
  promptBindings,
  webSearchBinding,
  webSearchConfigured,
  onConfigureWebSearch,
}: BuildAgentPromptCompletionOptionsParams): BindingCompletionOption[] => {
  const completions = bindingsToCompletions(
    promptBindings,
    EditorModes.Handlebars
  )

  if (webSearchConfigured || !webSearchBinding) {
    return completions
  }

  const [webSearchCompletion] = bindingsToCompletions(
    [webSearchBinding],
    EditorModes.Handlebars
  )
  if (!webSearchCompletion) {
    return completions
  }

  return [
    ...completions,
    {
      ...webSearchCompletion,
      apply: onConfigureWebSearch,
    },
  ]
}
