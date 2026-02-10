import tracer from "dd-trace"
import sdk from "../../.."
import { HTTPError, env } from "@budibase/backend-core"
import { BUDIBASE_AI_PROVIDER_ID } from "@budibase/types"
import { createLiteLLMOpenAI } from "./litellm"
export * from "./litellm"

export async function createLLM(
  configId: string,
  sessionId?: string,
  span?: tracer.Span
) {
  const aiConfig = await sdk.ai.configs.find(configId)
  if (!aiConfig) {
    throw new HTTPError("Config not found", 400)
  }

  if (aiConfig.provider === BUDIBASE_AI_PROVIDER_ID && !env.SELF_HOSTED) {
    // TODO
    throw "No implemented"
  }

  return createLiteLLMOpenAI(aiConfig, sessionId, span)
}
