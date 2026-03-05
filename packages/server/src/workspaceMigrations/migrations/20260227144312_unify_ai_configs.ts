import { configs } from "@budibase/backend-core"
import {
  AIConfigType,
  BUDIBASE_AI_PROVIDER_ID,
  Config,
  ConfigType,
} from "@budibase/types"
import sdk from "../../sdk"

type AIProvider =
  | "OpenAI"
  | "Anthropic"
  | "AzureOpenAI"
  | "TogetherAI"
  | "Custom"
  | "BudibaseAI"

export interface ProviderConfig {
  provider: AIProvider
  isDefault: boolean
  name: string
  active: boolean
  baseUrl?: string
  apiKey?: string
  defaultModel?: string
}

interface AIInnerConfig {
  [key: string]: ProviderConfig
}

export interface AIConfig extends Config<AIInnerConfig> {}

export const defaultModelByProvider: Record<AIProvider, string> = {
  OpenAI: "gpt-5-mini",
  TogetherAI: "gpt-5-mini",
  AzureOpenAI: "gpt-4.1",
  Custom: "gpt-5-mini",
  Anthropic: "claude-3-5-sonnet-20240620",
  BudibaseAI: "gpt-5-mini",
}

const normalizeAzureBaseUrl = (baseUrl: string): string => {
  try {
    const parsed = new URL(baseUrl)
    parsed.pathname = parsed.pathname.replace(/\/openai\/?.*$/i, "/")
    parsed.search = ""
    parsed.hash = ""
    return parsed.toString().replace(/\/$/, "")
  } catch {
    return baseUrl.replace(/\/openai\/?.*$/i, "").replace(/\/$/, "")
  }
}

const mapCredentials = (config: ProviderConfig): Record<string, string> => {
  if (config.provider === "BudibaseAI") {
    return {}
  }

  const credentials: Record<string, string> = {}
  if (config.apiKey) {
    credentials.api_key = config.apiKey
  }
  if (config.baseUrl) {
    credentials.api_base =
      config.provider === "AzureOpenAI"
        ? normalizeAzureBaseUrl(config.baseUrl)
        : config.baseUrl
  }
  return credentials
}

const normalizeProvider = (provider: string) => {
  if (provider === "BudibaseAI") {
    return BUDIBASE_AI_PROVIDER_ID
  }

  if (provider === "AzureOpenAI") {
    return "Azure"
  }

  return provider
}

const normalizeModel = (provider: string, model: string) => {
  if (provider !== BUDIBASE_AI_PROVIDER_ID) {
    return model
  }

  if (model.startsWith("budibase/legacy/")) {
    return model
  }

  return `budibase/legacy/${model}`
}

const migration = async () => {
  const legacyConfig = await configs.getConfig<AIConfig>(ConfigType.AI)
  if (!legacyConfig?.config) {
    return
  }

  const existingConfigs = await sdk.ai.configs.fetch()
  const existingBySignature = new Set(
    existingConfigs.map(
      config => `${config.provider}:${config.model}:${config.configType}`
    )
  )
  const hasDefaultCompletions = existingConfigs.some(
    config =>
      config.configType === AIConfigType.COMPLETIONS &&
      config.isDefault === true
  )

  let defaultAlreadyAssigned = hasDefaultCompletions

  for (const legacyProvider of Object.values(legacyConfig.config)) {
    if (!legacyProvider?.active) {
      continue
    }

    const model =
      legacyProvider.defaultModel ||
      defaultModelByProvider[legacyProvider.provider]
    if (!model) {
      continue
    }

    const provider = normalizeProvider(legacyProvider.provider)
    const normalizedModel = normalizeModel(provider, model)
    const signature = `${provider}:${normalizedModel}:${AIConfigType.COMPLETIONS}`
    if (existingBySignature.has(signature)) {
      continue
    }

    try {
      await sdk.ai.configs.create({
        name: legacyProvider.name || legacyProvider.provider,
        provider,
        model: normalizedModel,
        credentialsFields: mapCredentials(legacyProvider),
        configType: AIConfigType.COMPLETIONS,
        isDefault: !defaultAlreadyAssigned && legacyProvider.isDefault === true,
      })
      existingBySignature.add(signature)
      if (legacyProvider.isDefault === true) {
        defaultAlreadyAssigned = true
      }
    } catch (err: any) {
      console.warn(
        `Skipping legacy AI config migration for provider ${legacyProvider.provider}: ${err?.message || "unknown error"}`
      )
    }
  }
}

export default migration
