import { AIConfig } from "@budibase/types"

const BUDIBASE_AI_CONFIG_ID = "budibase_ai"
export function addBudibaseAIConfig(aiConfig: AIConfig) {
  aiConfig.config[BUDIBASE_AI_CONFIG_ID] = {
    provider: "OpenAI",
    active: true,
    isDefault: Object.keys(aiConfig.config).every(
      key => !aiConfig.config[key].isDefault
    ),
    defaultModel: process.env.BUDIBASE_AI_DEFAULT_MODEL || "gpt-4o-mini",
    apiKey: process.env.OPENAI_API_KEY,
    name: "Budibase AI",
  }
}
