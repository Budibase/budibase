import { HTTPError } from "@budibase/backend-core"
import { AIConfigType } from "@budibase/types"
import { createLLM } from "."
import { configs } from ".."

export async function getDefaultLLMOrThrow() {
  const allConfigs = await configs.fetch()
  const configToUse = allConfigs.find(
    c => c.configType === AIConfigType.COMPLETIONS
  )
  if (!configToUse?._id) {
    throw new HTTPError("No available LLM configurations", 500)
  }

  return createLLM(configToUse._id)
}
