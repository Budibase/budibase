import { features, HTTPError } from "@budibase/backend-core"
import { AIConfigType, FeatureFlag, LLMResponse } from "@budibase/types"
import { createLLM } from "."
import { configs } from ".."
import { createLegacyLLM } from "./legacy"

export async function getDefaultLLM(): Promise<LLMResponse | undefined> {
  if (!(await features.isEnabled(FeatureFlag.USE_NEW_AICONFIGS))) {
    return await createLegacyLLM()
  }

  const allConfigs = await configs.fetch()
  const configToUse = allConfigs.find(
    c => c.configType === AIConfigType.COMPLETIONS && c.isDefault === true
  )
  if (!configToUse?._id) {
    return await createLegacyLLM()
  }

  return createLLM(configToUse._id)
}

export async function getDefaultLLMOrThrow(): Promise<LLMResponse> {
  const llm = await getDefaultLLM()
  if (!llm) {
    throw new HTTPError("No available LLM configurations", 500)
  }
  return llm
}
