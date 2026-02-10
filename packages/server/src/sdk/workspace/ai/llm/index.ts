import tracer from "dd-trace"
import sdk from "../../.."
import { HTTPError, env } from "@budibase/backend-core"
import { BUDIBASE_AI_PROVIDER_ID } from "@budibase/types"
import { createLiteLLMOpenAI } from "./litellm"
import { createBBAIClient } from "./bbai"

export * as bbai from "./bbai"

export async function createLLM(
  configId: string,
  sessionId?: string,
  span?: tracer.Span
) {
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
