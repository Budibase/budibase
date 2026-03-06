import { HTTPError, env } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { BUDIBASE_AI_PROVIDER_ID, LLMResponse } from "@budibase/types"
import tracer from "dd-trace"
import sdk from "../../.."
import { createBBAIClient } from "./bbai"
import { createLiteLLMOpenAI } from "./litellm"

export * as bbai from "./bbai"
export * from "./utils"
export * from "./messages"

export async function createLLM(
  configId: string,
  sessionId?: string,
  span?: tracer.Span,
  agentId?: string
): Promise<LLMResponse> {
  if (!configId) {
    throw new HTTPError("Config id not found", 422)
  }
  const aiConfig = await sdk.ai.configs.find(configId)
  if (!aiConfig) {
    throw new HTTPError(`Config id "${configId}" not found`, 422)
  }

  if (aiConfig.provider === BUDIBASE_AI_PROVIDER_ID) {
    await quotas.throwIfBudibaseAICreditsExceeded()
  }

  if (aiConfig.provider === BUDIBASE_AI_PROVIDER_ID && !env.SELF_HOSTED) {
    return createBBAIClient(
      aiConfig.model,
      sessionId,
      span,
      aiConfig.reasoningEffort,
      agentId
    )
  }

  return createLiteLLMOpenAI(aiConfig, sessionId, span, agentId)
}
