import { context, docIds, HTTPError } from "@budibase/backend-core"
import {
  AIConfigType,
  LLMProviderField,
  CustomAIProviderConfig,
  DocumentType,
  LLMProvider,
  PASSWORD_REPLACEMENT,
  RequiredKeys,
} from "@budibase/types"
import environment from "../../../../environment"
import * as liteLLM from "./litellm"

const withDefaults = (
  config: CustomAIProviderConfig
): CustomAIProviderConfig => ({
  ...config,
  configType: config.configType ?? AIConfigType.COMPLETIONS,
})

export async function fetch(): Promise<CustomAIProviderConfig[]> {
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<CustomAIProviderConfig>(
    docIds.getDocParams(DocumentType.AI_CONFIG, undefined, {
      include_docs: true,
    })
  )

  return result.rows
    .map(row => row.doc)
    .filter((doc): doc is CustomAIProviderConfig => !!doc)
    .map(withDefaults)
}

export async function find(
  id: string
): Promise<CustomAIProviderConfig | undefined> {
  const db = context.getWorkspaceDB()
  const result = await db.tryGet<CustomAIProviderConfig>(id)
  return result ? withDefaults(result) : result
}

export async function create(
  config: CustomAIProviderConfig
): Promise<CustomAIProviderConfig> {
  const db = context.getWorkspaceDB()

  const configToSave = {
    provider: config.provider,
    name: config.model,
    credentialFields: config.credentialsFields,
    configType: config.configType,
  }

  await liteLLM.validateConfig(configToSave)
  const modelId = await liteLLM.addModel(configToSave)

  const newConfig: CustomAIProviderConfig = {
    _id: docIds.generateAIConfigID(),
    name: config.name,
    provider: config.provider,
    credentialsFields: config.credentialsFields,
    model: config.model,
    liteLLMModelId: modelId,
    ...(config.webSearchConfig && { webSearchConfig: config.webSearchConfig }),
    configType: config.configType,
  }

  const { rev } = await db.put(newConfig)
  newConfig._rev = rev

  await liteLLM.syncKeyModels()

  return newConfig
}

export async function update(
  config: CustomAIProviderConfig
): Promise<CustomAIProviderConfig> {
  const id = config._id
  if (!id) {
    throw new HTTPError("id cannot be empty", 400)
  }

  const existing = await find(id)
  if (!existing) {
    throw new HTTPError("Config to edit not found", 404)
  }

  if (config.credentialsFields) {
    const mergedCredentials = {
      ...(existing.credentialsFields || {}),
      ...config.credentialsFields,
    }

    Object.entries(mergedCredentials).forEach(([key, value]) => {
      if (value === PASSWORD_REPLACEMENT) {
        mergedCredentials[key] = existing.credentialsFields?.[key] || ""
      }
    })

    config.credentialsFields = mergedCredentials
  }

  if (config.webSearchConfig?.apiKey === PASSWORD_REPLACEMENT) {
    config.webSearchConfig.apiKey = existing.webSearchConfig?.apiKey || ""
  }

  const updatedConfig: CustomAIProviderConfig = {
    ...existing,
    ...config,
  }

  const db = context.getWorkspaceDB()
  const { rev } = await db.put(updatedConfig)
  updatedConfig._rev = rev

  function getLiteLLMAwareFields(config: CustomAIProviderConfig) {
    return {
      provider: config.provider,
      name: config.model,
      credentialFields: config.credentialsFields,
      configType: config.configType,
    }
  }

  const shouldUpdateLiteLLM =
    JSON.stringify(getLiteLLMAwareFields(updatedConfig)) !==
    JSON.stringify(getLiteLLMAwareFields(existing))

  if (shouldUpdateLiteLLM) {
    try {
      await liteLLM.updateModel({
        llmModelId: updatedConfig.liteLLMModelId,
        provider: updatedConfig.provider,
        name: updatedConfig.model,
        credentialFields: updatedConfig.credentialsFields,
        configType: updatedConfig.configType,
      })
      await liteLLM.syncKeyModels()
    } catch (err) {
      await db.put({
        ...existing,
        _rev: updatedConfig._rev,
      })
      throw err
    }
  }

  return updatedConfig
}

export async function remove(id: string) {
  const db = context.getWorkspaceDB()

  const existing = await db.get<CustomAIProviderConfig>(id)
  await db.remove(existing)

  await liteLLM.syncKeyModels()
}

export async function getLiteLLMModelConfigOrThrow(configId: string): Promise<{
  modelName: string
  modelId: string
  apiKey: string
  baseUrl: string
}> {
  const aiConfig = await find(configId)

  if (!aiConfig) {
    throw new HTTPError("Config not found", 400)
  }

  const { secretKey } = await liteLLM.getKeySettings()
  if (!secretKey) {
    throw new HTTPError(
      "LiteLLM should be configured. Contact support if the issue persists.",
      500
    )
  }

  return {
    modelName: aiConfig.model,
    modelId: aiConfig.liteLLMModelId,
    apiKey: secretKey,
    baseUrl: environment.LITELLM_URL,
  }
}

let liteLLMProviders: LLMProvider[]

export async function fetchLiteLLMProviders(): Promise<LLMProvider[]> {
  if (!liteLLMProviders?.length) {
    const providers = await liteLLM.fetchPublicProviders()
    liteLLMProviders = providers.map(provider => {
      const mapProvider: RequiredKeys<LLMProvider> = {
        id: provider.provider,
        displayName: provider.provider_display_name,
        externalProvider: provider.litellm_provider,
        credentialFields: provider.credential_fields.map(f => {
          const field: RequiredKeys<LLMProviderField> = {
            key: f.key,
            label: f.label,
            placeholder: f.placeholder,
            tooltip: f.tooltip,
            required: f.required,
            field_type: f.field_type,
            options: f.options,
            default_value: f.default_value,
          }
          return field
        }),
      }
      return mapProvider
    })
  }
  return liteLLMProviders
}
