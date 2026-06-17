import {
  context,
  docIds,
  encryption,
  env,
  events,
  HTTPError,
} from "@budibase/backend-core"
import { licensing } from "@budibase/pro"
import {
  AIConfigType,
  BUDIBASE_AI_PROVIDER_ID,
  CustomAIProviderConfig,
  DocumentType,
  LLMProvider,
  LLMProviderField,
  PASSWORD_REPLACEMENT,
  RequiredKeys,
} from "@budibase/types"
import * as liteLLM from "./litellm"
import { processEnvironmentVariable } from "../../../utils"
import { IMPORT_PENDING_LITELLM_MODEL_ID } from "../../backups/constants"

const SECRET_ENCODING_PREFIX = "bbai_enc::"

const normalizeProviderModelId = (
  modelId: string,
  providerId: string
): string => {
  const providerPrefix = `${providerId}/`
  return modelId.startsWith(providerPrefix)
    ? modelId.slice(providerPrefix.length)
    : modelId
}

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

const resolveCredentialFields = async (
  credentialFields: Record<string, string>
) => {
  return await processEnvironmentVariable({
    ...credentialFields,
  })
}

const ensureDefaultUniqueness = async (excludeId?: string) => {
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<CustomAIProviderConfig>(
    docIds.getDocParams(DocumentType.AI_CONFIG, undefined, {
      include_docs: true,
    })
  )

  const docsToUpdate = result.rows
    .map(row => row.doc)
    .filter((doc): doc is CustomAIProviderConfig => !!doc)
    .filter(
      doc =>
        doc.configType === AIConfigType.COMPLETIONS &&
        doc.isDefault === true &&
        doc._id !== excludeId
    )
    .map(doc => ({
      ...doc,
      isDefault: false,
    }))

  for (const doc of docsToUpdate) {
    await db.put(doc)
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
    | "isDefault"
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

  const configId =
    config.provider === BUDIBASE_AI_PROVIDER_ID
      ? docIds.generateAIConfigID("bbai")
      : docIds.generateAIConfigID()

  let modelId
  if (!isBBAI || isSelfhost) {
    const resolvedCredentialFields = await resolveCredentialFields(
      config.credentialsFields
    )

    await liteLLM.validateConfig({
      provider: config.provider,
      name: config.model,
      credentialFields: resolvedCredentialFields,
      configType: config.configType,
    })

    modelId = await liteLLM.addModel({
      configId,
      provider: config.provider,
      model: config.model,
      credentialFields: resolvedCredentialFields,
      reasoningEffort: config.reasoningEffort,
    })
  } else {
    modelId = BUDIBASE_AI_PROVIDER_ID
  }

  const newConfig: CustomAIProviderConfig = {
    _id: configId,
    name: config.name,
    provider: config.provider,
    credentialsFields: config.credentialsFields,
    model: config.model,
    liteLLMModelId: modelId,
    ...(config.webSearchConfig && { webSearchConfig: config.webSearchConfig }),
    configType: config.configType,
    reasoningEffort: config.reasoningEffort,
    isDefault: config.isDefault,
  }

  const encodedConfig: CustomAIProviderConfig = {
    ...newConfig,
    ...(await encodeConfigSecrets(newConfig)),
  }
  const { rev } = await db.put(encodedConfig)
  newConfig._rev = rev

  if (
    newConfig.configType === AIConfigType.COMPLETIONS &&
    newConfig.isDefault === true
  ) {
    await ensureDefaultUniqueness(newConfig._id)
  }

  await liteLLM.syncKeyModels()
  events.ai.configCreated(newConfig)

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
    | "isDefault"
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
    isDefault: config.isDefault ?? existing.isDefault,
  }

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
    const resolvedCredentialFields = await resolveCredentialFields(
      updatedConfig.credentialsFields
    )

    await liteLLM.validateConfig({
      provider: updatedConfig.provider,
      name: updatedConfig.model,
      credentialFields: resolvedCredentialFields,
      configType: updatedConfig.configType,
    })
  }

  const db = context.getWorkspaceDB()
  const encodedConfig: CustomAIProviderConfig = {
    ...updatedConfig,
    ...(await encodeConfigSecrets(updatedConfig)),
  }
  const { rev } = await db.put(encodedConfig)
  updatedConfig._rev = rev

  if (
    updatedConfig.configType === AIConfigType.COMPLETIONS &&
    updatedConfig.isDefault === true
  ) {
    await ensureDefaultUniqueness(updatedConfig._id)
  }

  if (shouldUpdateLiteLLM) {
    try {
      const resolvedCredentialFields = await resolveCredentialFields(
        updatedConfig.credentialsFields
      )

      await liteLLM.updateModel({
        configId: id,
        llmModelId: updatedConfig.liteLLMModelId,
        provider: updatedConfig.provider,
        name: updatedConfig.model,
        credentialFields: resolvedCredentialFields,
        reasoningEffort: updatedConfig.reasoningEffort,
      })
      await liteLLM.syncKeyModels()
    } catch (err) {
      const rollbackConfig: CustomAIProviderConfig = {
        ...existing,
        ...(await encodeConfigSecrets(existing)),
        _rev: updatedConfig._rev,
      }
      await db.put(rollbackConfig)
      throw err
    }
  }

  events.ai.configUpdated(updatedConfig)

  return updatedConfig
}

export async function remove(id: string) {
  const db = context.getWorkspaceDB()

  const existing = await db.get<CustomAIProviderConfig>(id)
  await db.remove(existing)
  events.ai.configDeleted(existing)

  await liteLLM.syncKeyModels()
}

export async function reconcileLiteLLMModels() {
  const workspaceId = context.getWorkspaceId()
  const status = await getLiteLLMStatus()
  if (status === liteLLM.LiteLLMStatus.NOT_CONFIGURED) {
    console.log("Skipping LiteLLM reconciliation: LiteLLM is not configured", {
      workspaceId,
    })
    return
  }

  const db = context.getWorkspaceDB()
  const existingConfigs = await fetch()
  const isSelfhost = env.SELF_HOSTED
  console.log("Starting LiteLLM reconciliation", {
    workspaceId,
    configCount: existingConfigs.length,
    isSelfhost: !!isSelfhost,
  })

  for (const existingConfig of existingConfigs) {
    if (!existingConfig._id) {
      continue
    }

    const isBBAI = existingConfig.provider === BUDIBASE_AI_PROVIDER_ID
    if (isBBAI && !isSelfhost) {
      console.log("Skipping Budibase AI config reconciliation in cloud", {
        workspaceId,
        configId: existingConfig._id,
      })
      continue
    }

    const resolvedCredentialFields = await resolveCredentialFields(
      existingConfig.credentialsFields
    )
    const currentModelId = existingConfig.liteLLMModelId
    let modelId = currentModelId

    let modelAlreadyExisted = false

    if (currentModelId !== IMPORT_PENDING_LITELLM_MODEL_ID) {
      try {
        await liteLLM.updateModel({
          configId: existingConfig._id,
          llmModelId: currentModelId,
          provider: existingConfig.provider,
          name: existingConfig.model,
          credentialFields: resolvedCredentialFields,
          reasoningEffort: existingConfig.reasoningEffort,
        })
        modelAlreadyExisted = true
        console.log("Refreshed the existing LiteLLM model", {
          workspaceId,
          configId: existingConfig._id,
          modelId: currentModelId,
        })
      } catch (e: any) {
        if (e.status !== 404) {
          throw e
        }
        console.log("LiteLLM model not found, creating a new one", {
          workspaceId,
          configId: existingConfig._id,
          modelId: currentModelId,
        })
      }
    } else {
      console.log("Config marked as pending model creation", {
        workspaceId,
        configId: existingConfig._id,
      })
    }

    if (!modelAlreadyExisted) {
      modelId = await liteLLM.addModel({
        configId: existingConfig._id,
        provider: existingConfig.provider,
        model: existingConfig.model,
        credentialFields: resolvedCredentialFields,
        reasoningEffort: existingConfig.reasoningEffort,
      })
      console.log("Created LiteLLM model", {
        workspaceId,
        configId: existingConfig._id,
        modelId,
      })
    }

    if (modelId !== currentModelId) {
      const updatedConfig: CustomAIProviderConfig = {
        ...existingConfig,
        liteLLMModelId: modelId,
      }
      const encodedConfig: CustomAIProviderConfig = {
        ...updatedConfig,
        ...(await encodeConfigSecrets(updatedConfig)),
      }
      await db.put(encodedConfig)
    }
  }

  await liteLLM.syncKeyModels()
  console.log("Finished LiteLLM reconciliation", { workspaceId })
}

let liteLLMProviders: LLMProvider[]

export async function fetchLiteLLMProviders(): Promise<LLMProvider[]> {
  if (!liteLLMProviders?.length) {
    const [providers, modelCostMap] = await Promise.all([
      liteLLM.fetchPublicProviders(),
      liteLLM.fetchPublicModelCostMap(),
    ])

    liteLLMProviders = providers.map(provider => {
      const modelsByType = Object.entries(modelCostMap).reduce<{
        completions: string[]
      }>(
        (acc, [modelId, metadata]) => {
          const modelProvider = metadata?.litellm_provider
          const isMatchingProvider = Array.isArray(modelProvider)
            ? modelProvider.includes(provider.litellm_provider)
            : typeof modelProvider === "string"
              ? modelProvider
                  .split(",")
                  .map(value => value.trim())
                  .includes(provider.litellm_provider)
              : false

          if (!isMatchingProvider) {
            return acc
          }

          const normalizedModelId = normalizeProviderModelId(
            modelId,
            provider.litellm_provider
          )

          const modelModes = Array.isArray(metadata?.mode)
            ? metadata.mode
            : typeof metadata?.mode === "string"
              ? metadata.mode.split(",")
              : []
          const normalizedModes = modelModes.map(mode =>
            mode.trim().toLowerCase()
          )

          if (
            !normalizedModes.length ||
            normalizedModes.some(mode =>
              ["chat", "completion", "responses"].includes(mode)
            )
          ) {
            acc.completions.push(normalizedModelId)
          }

          return acc
        },
        { completions: [] }
      )

      const models = {
        completions: [...new Set(modelsByType.completions)].sort((a, b) =>
          a.localeCompare(b)
        ),
      }

      const mapProvider: RequiredKeys<LLMProvider> = {
        id: provider.provider,
        displayName: provider.provider_display_name,
        externalProvider: provider.litellm_provider,
        models,
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
      models: {
        completions: ["budibase/v1"],
      },
      credentialFields: [
        { key: "api_key", label: "api_key", field_type: "password" },
      ],
    })
  }
  return liteLLMProviders
}

export async function getLiteLLMStatus(args?: {
  signal?: AbortSignal
}): Promise<liteLLM.LiteLLMStatus> {
  return liteLLM.getLiteLLMStatus(args)
}

export { LiteLLMStatus } from "./litellm"
