import { env, HTTPError } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { BUDIBASE_AI_MODEL_MAP, type BudibaseAIProvider } from "@budibase/types"

type BudibaseAIModelMap = typeof BUDIBASE_AI_MODEL_MAP

const availableBudibaseAIModels: BudibaseAIModelMap = {
  ...BUDIBASE_AI_MODEL_MAP,
  "legacy/gpt-4o-mini": {
    provider: "openai",
    model: "gpt-4o-mini",
  },
  "legacy/gpt-4o": {
    provider: "openai",
    model: "gpt-4o",
  },
  "legacy/gpt-5": {
    provider: "openai",
    model: "gpt-5",
  },
  "legacy/gpt-5-mini": {
    provider: "openai",
    model: "gpt-5-mini",
  },
  "legacy/gpt-5-nano": {
    provider: "openai",
    model: "gpt-5-nano",
  },
}

export interface BudibaseAIProviderRequest {
  provider: BudibaseAIProvider
  model: string
  apiKey: string
  baseUrl: string
}

export interface BudibaseAITokenUsage {
  inputTokens?: number
  outputTokens?: number
}

export const resolveBudibaseAIProviderRequest = (
  model: string
): BudibaseAIProviderRequest => {
  const bbaiModel = availableBudibaseAIModels[model]
  if (!bbaiModel) {
    throw new HTTPError(`Unsupported BBAI model: ${model}`, 400)
  }

  if (bbaiModel.provider === "openai") {
    if (!env.BBAI_OPENAI_API_KEY) {
      throw new HTTPError("OPENAI API key not configured", 500)
    }
    return {
      provider: bbaiModel.provider,
      model: bbaiModel.model,
      apiKey: env.BBAI_OPENAI_API_KEY,
      baseUrl: "https://api.openai.com/v1",
    }
  }

  if (!env.OPENROUTER_BASE_URL) {
    throw new HTTPError("OPENROUTER_BASE_URL not configured", 500)
  }
  if (!env.BBAI_OPENROUTER_API_KEY) {
    throw new HTTPError("OPENROUTER API key not configured", 500)
  }

  return {
    provider: bbaiModel.provider,
    model: bbaiModel.model,
    apiKey: env.BBAI_OPENROUTER_API_KEY,
    baseUrl: env.OPENROUTER_BASE_URL,
  }
}

export const calculateBudibaseAICredits = (
  usage?: BudibaseAITokenUsage
): number => {
  if (!usage) {
    return 0
  }
  const inputTokens = usage.inputTokens ?? 0
  const outputTokens = usage.outputTokens ?? 0
  return outputTokens * 3 + inputTokens
}

export const incrementBudibaseAICreditsFromTokenUsage = async (
  usage?: BudibaseAITokenUsage
) => {
  console.log(JSON.stringify(usage))
  const credits = calculateBudibaseAICredits(usage)
  if (credits > 0) {
    await quotas.incrementBudibaseAICredits(credits)
  }
}
