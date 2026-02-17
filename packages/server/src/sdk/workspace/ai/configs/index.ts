import {
  context,
  docIds,
  encryption,
  env,
  HTTPError,
} from "@budibase/backend-core"
import { licensing } from "@budibase/pro"
import {
  BUDIBASE_AI_PROVIDER_ID,
  CustomAIProviderConfig,
  DocumentType,
  LLMProvider,
  LLMProviderField,
  PASSWORD_REPLACEMENT,
  RequiredKeys,
} from "@budibase/types"
import * as liteLLM from "./litellm"

const SECRET_ENCODING_PREFIX = "bbai_enc::"

const encodeSecret = (value: string): string => {
  if (!value || value.startsWith(SECRET_ENCODING_PREFIX)) {
    return value
  }
  return `${SECRET_ENCODING_PREFIX}${encryption.encrypt(value)}`
}

const decodeSecret = (value: string): string => {
  if (!value || !value.startsWith(SECRET_ENCODING_PREFIX)) {
    return value
  }
  return encryption.decrypt(value.slice(SECRET_ENCODING_PREFIX.length))
}

const getPasswordCredentialFieldKeys = async (
  providerId: string
): Promise<Set<string>> => {
  const providers = await fetchLiteLLMProviders()
  const provider = providers.find(p => p.id === providerId)
  return new Set(
    provider?.credentialFields
      .filter(field => field.field_type === "password")
      .map(field => field.key) || []
  )
}

const encodeConfigSecrets = async (
  config: Pick<
    CustomAIProviderConfig,
    "provider" | "credentialsFields" | "webSearchConfig"
  >
) => {
  const passwordKeys = await getPasswordCredentialFieldKeys(config.provider)
  return {
    credentialsFields: Object.fromEntries(
      Object.entries(config.credentialsFields || {}).map(([key, value]) => [
        key,
        typeof value === "string" && passwordKeys.has(key)
          ? encodeSecret(value)
          : value,
      ])
    ),
    webSearchConfig: config.webSearchConfig
      ? {
          ...config.webSearchConfig,
          apiKey: config.webSearchConfig.apiKey
            ? encodeSecret(config.webSearchConfig.apiKey)
            : config.webSearchConfig.apiKey,
        }
      : undefined,
  }
}

const decodeConfigSecrets = (
  config: CustomAIProviderConfig
): CustomAIProviderConfig => {
  return {
    ...config,
    credentialsFields: Object.fromEntries(
      Object.entries(config.credentialsFields || {}).map(([key, value]) => [
        key,
        typeof value === "string" ? decodeSecret(value) : value,
      ])
    ),
    ...(config.webSearchConfig
      ? {
          webSearchConfig: {
            ...config.webSearchConfig,
            apiKey: config.webSearchConfig.apiKey
              ? decodeSecret(config.webSearchConfig.apiKey)
              : config.webSearchConfig.apiKey,
          },
        }
      : {}),
  }
}

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
    .map(config => decodeConfigSecrets(config))
}

export async function find(
  id: string
): Promise<CustomAIProviderConfig | undefined> {
  const db = context.getWorkspaceDB()
  const result = await db.tryGet<CustomAIProviderConfig>(id)
  return result ? decodeConfigSecrets(result) : undefined
}

export async function create(
  config: Pick<
    CustomAIProviderConfig,
    | "model"
    | "provider"
    | "credentialsFields"
    | "configType"
    | "reasoningEffort"
    | "webSearchConfig"
    | "name"
  >
): Promise<CustomAIProviderConfig> {
  const db = context.getWorkspaceDB()

  const isBBAI = config.provider === BUDIBASE_AI_PROVIDER_ID
  const isSelfhost = env.SELF_HOSTED

  if (isBBAI && isSelfhost) {
    const baseUrl = env.BUDICLOUD_URL.endsWith("/")
      ? env.BUDICLOUD_URL
      : `${env.BUDICLOUD_URL}/`
    config.credentialsFields.api_base = new URL("api/ai", baseUrl).toString()
    const licenseKey = await licensing.keys.getLicenseKey()
    if (!licenseKey) {
      throw new HTTPError("No license key found", 422)
    }
    config.credentialsFields.api_key = licenseKey
  }

  let modelId
  if (!isBBAI || isSelfhost) {
    modelId = await liteLLM.addModel({
      provider: config.provider,
      model: config.model,
      credentialFields: config.credentialsFields,
      configType: config.configType,
      reasoningEffort: config.reasoningEffort,
    })
  } else {
    modelId = BUDIBASE_AI_PROVIDER_ID
  }

  const newConfig: CustomAIProviderConfig = {
    _id:
      config.provider === BUDIBASE_AI_PROVIDER_ID
        ? docIds.generateAIConfigID("bbai")
        : docIds.generateAIConfigID(),
    name: config.name,
    provider: config.provider,
    credentialsFields: config.credentialsFields,
    model: config.model,
    liteLLMModelId: modelId,
    ...(config.webSearchConfig && { webSearchConfig: config.webSearchConfig }),
    configType: config.configType,
    reasoningEffort: config.reasoningEffort,
  }

  const encodedConfig: CustomAIProviderConfig = {
    ...newConfig,
    ...(await encodeConfigSecrets(newConfig)),
  }
  const { rev } = await db.put(encodedConfig)
  newConfig._rev = rev

  await liteLLM.syncKeyModels()

  return newConfig
}

export async function update(
  config: Pick<
    CustomAIProviderConfig,
    | "_id"
    | "_rev"
    | "name"
    | "provider"
    | "credentialsFields"
    | "model"
    | "configType"
    | "reasoningEffort"
    | "webSearchConfig"
  >
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
  const encodedConfig: CustomAIProviderConfig = {
    ...updatedConfig,
    ...(await encodeConfigSecrets(updatedConfig)),
  }
  const { rev } = await db.put(encodedConfig)
  updatedConfig._rev = rev

  function getLiteLLMAwareFields(config: CustomAIProviderConfig) {
    return {
      provider: config.provider,
      name: config.model,
      credentialFields: config.credentialsFields,
      configType: config.configType,
      reasoningEffort: config.reasoningEffort,
    }
  }

  const isBBAI = config.provider === BUDIBASE_AI_PROVIDER_ID
  const isSelfhost = env.SELF_HOSTED
  const shouldUpdateLiteLLM =
    JSON.stringify(getLiteLLMAwareFields(updatedConfig)) !==
      JSON.stringify(getLiteLLMAwareFields(existing)) &&
    (isSelfhost || !isBBAI)

  if (shouldUpdateLiteLLM) {
    try {
      await liteLLM.updateModel({
        llmModelId: updatedConfig.liteLLMModelId,
        provider: updatedConfig.provider,
        name: updatedConfig.model,
        credentialFields: updatedConfig.credentialsFields,
        configType: updatedConfig.configType,
        reasoningEffort: updatedConfig.reasoningEffort,
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

    liteLLMProviders.push({
      id: BUDIBASE_AI_PROVIDER_ID,
      displayName: "Budibase AI",
      externalProvider: "custom_openai",
      credentialFields: [
        { key: "api_key", label: "api_key", field_type: "password" },
      ],
    })
  }
  return liteLLMProviders
}
