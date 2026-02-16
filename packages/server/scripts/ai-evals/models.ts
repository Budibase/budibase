import { BUDIBASE_AI_MODEL_MAP } from "@budibase/types"
import { EvalModelConfig } from "./types"

const DEFAULT_MODEL_IDS = [
  "budibase/gpt-5-nano",
  "budibase/mistral-small-latest",
]

export function resolveModelConfigs(): EvalModelConfig[] {
  const configured = process.env.AI_EVAL_MODEL_IDS
  const modelIds = configured
    ? configured
        .split(",")
        .map(value => value.trim())
        .filter(Boolean)
    : DEFAULT_MODEL_IDS

  const result: EvalModelConfig[] = []
  for (const modelId of modelIds) {
    const mapped = BUDIBASE_AI_MODEL_MAP[modelId]
    if (!mapped) {
      throw new Error(`Unsupported Budibase AI model ID: ${modelId}`)
    }
    result.push({
      modelId,
      provider: mapped.provider,
    })
  }

  return result
}

export function validateProviderSecrets(modelConfigs: EvalModelConfig[]): void {
  const hasOpenAiModel = modelConfigs.some(config => config.provider === "openai")
  const hasMistralModel = modelConfigs.some(config => config.provider === "mistral")

  if (hasOpenAiModel && !process.env.BBAI_OPENAI_API_KEY) {
    throw new Error(
      "Missing required secret: BBAI_OPENAI_API_KEY for configured OpenAI Budibase AI models"
    )
  }

  if (hasMistralModel) {
    if (!process.env.BBAI_MISTRAL_API_KEY) {
      throw new Error(
        "Missing required secret: BBAI_MISTRAL_API_KEY for configured Mistral Budibase AI models"
      )
    }
    if (!process.env.MISTRAL_BASE_URL) {
      throw new Error(
        "Missing required secret: MISTRAL_BASE_URL for configured Mistral Budibase AI models"
      )
    }
  }
}
