import { configs, context } from "@budibase/backend-core"
import {
  AIConfigType,
  BUDIBASE_AI_PROVIDER_ID,
  Config,
  ConfigType,
} from "@budibase/types"
import tracer from "dd-trace"
import sdk from "../../sdk"
import { LiteLLMStatus } from "../../sdk/workspace/ai/configs/litellm"

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

const normalizeOpenAIBaseUrl = (baseUrl: string): string => {
  try {
    const parsed = new URL(baseUrl)
    if (
      parsed.hostname.toLowerCase() === "api.openai.com" &&
      (!parsed.pathname || parsed.pathname === "/")
    ) {
      parsed.pathname = "/v1"
    }
    return parsed.toString().replace(/\/$/, "")
  } catch {
    if (/^https:\/\/api\.openai\.com\/?$/i.test(baseUrl.trim())) {
      return "https://api.openai.com/v1"
    }
    return baseUrl
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
        : config.provider === "OpenAI"
          ? normalizeOpenAIBaseUrl(config.baseUrl)
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
  await tracer.trace("workspaceMigration.unifyAIConfigs", async span => {
    span.addTags({
      workspaceId: context.getWorkspaceId(),
    })

    const liteLLMStatus = await sdk.ai.configs.getLiteLLMStatus()

    if (liteLLMStatus === LiteLLMStatus.NOT_CONFIGURED) {
      span.addTags({
        skipped: true,
        skipReason: `litellm_${liteLLMStatus}`,
      })
      console.warn(
        `Skipping AI config migration for workspace "${context.getWorkspaceId()}": LiteLLM status is "${liteLLMStatus}"`
      )
      return
    }

    const legacyConfig = await configs.getConfig<AIConfig>(ConfigType.AI)
    if (!legacyConfig?.config) {
      span.addTags({
        hasLegacyConfig: false,
        skipped: false,
        processedProviders: 0,
        createdConfigs: 0,
        skippedExisting: 0,
        skippedInvalid: 0,
      })
      return
    }

    const existingConfigs = await sdk.ai.configs.fetch()
    const hasDefaultCompletions = existingConfigs.some(
      config =>
        config.configType === AIConfigType.COMPLETIONS &&
        config.isDefault === true
    )

    let defaultAlreadyAssigned = hasDefaultCompletions
    let processedProviders = 0
    let createdConfigs = 0
    let skippedExisting = 0
    let skippedInvalid = 0

    for (const legacyProvider of Object.values(legacyConfig.config)) {
      if (!legacyProvider?.active) {
        continue
      }

      processedProviders++

      const model =
        legacyProvider.defaultModel ||
        defaultModelByProvider[legacyProvider.provider]
      if (!model) {
        skippedInvalid++
        continue
      }

      const provider = normalizeProvider(legacyProvider.provider)
      const normalizedModel = normalizeModel(provider, model)

      const name = legacyProvider.name || legacyProvider.provider
      const hasExistingConfig =
        existingConfigs.some(c => c.name === name) ||
        (provider === BUDIBASE_AI_PROVIDER_ID &&
          existingConfigs.some(
            c =>
              c.provider === BUDIBASE_AI_PROVIDER_ID &&
              c.configType === AIConfigType.COMPLETIONS
          ))
      if (hasExistingConfig) {
        skippedExisting++
        continue
      }

      try {
        await sdk.ai.configs.create({
          name: legacyProvider.name || legacyProvider.provider,
          provider,
          model: normalizedModel,
          credentialsFields: mapCredentials(legacyProvider),
          configType: AIConfigType.COMPLETIONS,
          isDefault:
            !defaultAlreadyAssigned && legacyProvider.isDefault === true,
        })
        createdConfigs++
        if (legacyProvider.isDefault === true) {
          defaultAlreadyAssigned = true
        }
      } catch (err: any) {
        if (err?.status === 400 || err?.statusCode === 400) {
          skippedInvalid++
          console.warn(
            `Skipping legacy AI config migration for provider ${legacyProvider.provider}: ${err?.message || "unknown error"}`
          )
          continue
        }
        throw err
      }
    }

    span.addTags({
      hasLegacyConfig: true,
      skipped: false,
      existingConfigs: existingConfigs.length,
      processedProviders,
      createdConfigs,
      skippedExisting,
      skippedInvalid,
      defaultAlreadyAssigned,
    })
  })
}

export default migration
