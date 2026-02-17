import { features, HTTPError } from "@budibase/backend-core"
import { AIConfigType, FeatureFlag } from "@budibase/types"
import { createLLM } from "."
import { configs } from ".."
import { createLegacyLLM } from "./legacy"

async function getLegacyLLMOrThrow() {
  const legacy = await createLegacyLLM()
  if (legacy) {
    return legacy
  }
  throw new HTTPError("No available LLM configurations", 500)
}

export async function getDefaultLLMOrThrow() {
  if (!(await features.isEnabled(FeatureFlag.USE_NEW_AICONFIGS))) {
    return getLegacyLLMOrThrow()
  }

  const allConfigs = await configs.fetch()
  const configToUse = allConfigs.find(
    c => c.configType === AIConfigType.COMPLETIONS
  )
  if (!configToUse?._id) {
    return getLegacyLLMOrThrow()
  }

  return createLLM(configToUse._id)
}
