import { configs } from "@budibase/backend-core"
import { AIConfigType, type ProviderConfig } from "@budibase/types"
import sdk from "../../sdk"
import { ai } from "@budibase/pro"

const mapCredentials = (config: ProviderConfig): Record<string, string> => {
  if (config.provider === "BudibaseAI") {
    return {}
  }

  const credentials: Record<string, string> = {}
  if (config.apiKey) {
    credentials.api_key = config.apiKey
  }
  if (config.baseUrl) {
    credentials.api_base = config.baseUrl
  }
  return credentials
}

const migration = async () => {
  const legacyConfig = await configs.getAIConfig()
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
      ai.DEFAULT_MODEL_BY_PROVIDER[legacyProvider.provider]
    if (!model) {
      continue
    }

    const signature = `${legacyProvider.provider}:${model}:${AIConfigType.COMPLETIONS}`
    if (existingBySignature.has(signature)) {
      continue
    }

    await sdk.ai.configs.create({
      name: legacyProvider.name || legacyProvider.provider,
      provider: legacyProvider.provider,
      model,
      credentialsFields: mapCredentials(legacyProvider),
      configType: AIConfigType.COMPLETIONS,
      isDefault: !defaultAlreadyAssigned && legacyProvider.isDefault === true,
    })
    existingBySignature.add(signature)
    if (legacyProvider.isDefault === true) {
      defaultAlreadyAssigned = true
    }
  }
}

export default migration
