import { HTTPError, env } from "@budibase/backend-core"
import { BUDIBASE_AI_PROVIDER_ID, LLMResponse } from "@budibase/types"
import tracer from "dd-trace"
import sdk from "../../.."
import { createBBAIClient } from "./bbai"
import { createLiteLLMOpenAI } from "./litellm"

export * as bbai from "./bbai"
export * from "./utils"

export async function createLLM(
  configId: string,
  sessionId?: string,
  span?: tracer.Span
): Promise<LLMResponse> {
  if (!configId) {
    throw new HTTPError("Config id not found", 422)
  }
  const aiConfig = await sdk.ai.configs.find(configId)
  if (!aiConfig) {
    throw new HTTPError(`Config id "${configId}" not found`, 422)
  }

  if (aiConfig.provider === BUDIBASE_AI_PROVIDER_ID && !env.SELF_HOSTED) {
    return createBBAIClient(aiConfig.model)
  }

  return createLiteLLMOpenAI(aiConfig, sessionId, span)
}
