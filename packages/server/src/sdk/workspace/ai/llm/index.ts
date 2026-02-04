import { ai } from "@budibase/pro"
import { AIConfigType } from "@budibase/types"
import sdk from "../../.."

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
  return (await getWorkspaceCompletionsLLM()) || (await ai.getLLM())
}

export async function getPreferredLLMOrThrow(): Promise<ai.LLM> {
  return (await getWorkspaceCompletionsLLM()) || (await ai.getLLMOrThrow())
}
