import { ai } from "@budibase/pro"
import { AIConfigType, FeatureFlag } from "@budibase/types"
import sdk from "../../.."
import { features } from "@budibase/backend-core"

async function getWorkspaceCompletionsLLM() {
  const configs = await sdk.ai.configs.fetch()
  const completionsConfig = configs.find(
    config =>
      (config.configType ?? AIConfigType.COMPLETIONS) ===
      AIConfigType.COMPLETIONS
  )

  if (!completionsConfig) {
    return
  }

  const { modelId, apiKey, baseUrl } =
    await sdk.ai.configs.getLiteLLMModelConfigOrThrow(completionsConfig._id!)

  return ai.getChatLLM({
    model: modelId,
    apiKey,
    baseUrl,
  })
}

export async function getPreferredLLM(): Promise<ai.LLM | undefined> {
  const useNewLLM = await features.isEnabled(FeatureFlag.USE_NEW_LLM)
  return (
    (useNewLLM && (await getWorkspaceCompletionsLLM())) || (await ai.getLLM())
  )
}

export async function getPreferredLLMOrThrow(): Promise<ai.LLM> {
  const useNewLLM = await features.isEnabled(FeatureFlag.USE_NEW_LLM)
  return (
    (useNewLLM && (await getWorkspaceCompletionsLLM())) ||
    (await ai.getLLMOrThrow())
  )
}
