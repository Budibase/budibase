import { env } from "@budibase/backend-core"
import { AIConfig } from "@budibase/types"

const BUDIBASE_AI_CONFIG_ID = "budibase_ai"

export async function enrichAIConfig(aiConfig: AIConfig) {
  if (env.SELF_HOSTED) {
    return aiConfig
  }

  // Don't insert a 2nd BudibaseAI config if one already exists.
  for (const config of Object.values(aiConfig.config)) {
    if (config.provider === "BudibaseAI") {
      return aiConfig
    }
  }

  aiConfig.config[BUDIBASE_AI_CONFIG_ID] = {
    provider: "BudibaseAI",
    active: true,
    isDefault: Object.keys(aiConfig.config).every(
      key => !aiConfig.config[key].isDefault
    ),
    defaultModel: process.env.BUDIBASE_AI_DEFAULT_MODEL || "gpt-5-mini",
    name: "Budibase AI",
  }

  return aiConfig
}
