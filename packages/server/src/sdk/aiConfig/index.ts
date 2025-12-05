import { configs, context, docIds, HTTPError } from "@budibase/backend-core"
import { ai } from "@budibase/pro"
import {
  ConfigType,
  CustomAIProviderConfig,
  DocumentType,
  PASSWORD_REPLACEMENT,
} from "@budibase/types"
import environment from "../../environment"
import * as liteLLM from "./litellm"

export async function fetch(): Promise<CustomAIProviderConfig[]> {
  const db = context.getGlobalDB()
  const result = await db.allDocs<CustomAIProviderConfig>(
    docIds.getDocParams(DocumentType.AI_CONFIG, undefined, {
      include_docs: true,
    })
  )

  return result.rows
    .map(row => row.doc)
    .filter((doc): doc is CustomAIProviderConfig => !!doc)
}

export async function find(
  id: string
): Promise<CustomAIProviderConfig | undefined> {
  const db = context.getGlobalDB()
  const result = await db.tryGet<CustomAIProviderConfig>(id)

  return result
}

async function ensureSingleDefault(currentId?: string) {
  const configs = await fetch()
  const db = context.getGlobalDB()
  const updates: CustomAIProviderConfig[] = []

  for (const config of configs) {
    if (!config.isDefault || config._id === currentId) {
      continue
    }
    updates.push({
      ...config,
      isDefault: false,
    })
  }

  if (updates.length) {
    await db.bulkDocs(updates)
  }
}

async function ensureLiteLLMConfigured() {
  let storedConfig = await configs.getSettingsConfigDoc()
  if (!storedConfig?.config.liteLLM?.keyId) {
    storedConfig ??= { type: ConfigType.SETTINGS, config: {} }
    const key = await liteLLM.generateKey(context.getTenantId())
    storedConfig.config.liteLLM = {
      keyId: key.id,
      secretKey: key.secret,
    }
    await context.getGlobalDB().put(storedConfig)
  }
  return storedConfig.config.liteLLM
}

export async function create(
  config: CustomAIProviderConfig
): Promise<CustomAIProviderConfig> {
  await ensureLiteLLMConfigured()

  const db = context.getGlobalDB()

  const modelId = await liteLLM.addModel({
    provider: config.provider,
    name: config.model,
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
  })

  const newConfig: CustomAIProviderConfig = {
    _id: docIds.generateAIConfigID(),
    isDefault: config.isDefault ?? false,
    name: config.name,
    baseUrl: config.baseUrl,
    provider: config.provider,
    model: config.model,
    apiKey: config.apiKey,
    liteLLMModelId: modelId,
  }

  const { rev } = await db.put(newConfig)
  newConfig._rev = rev

  if (newConfig.isDefault) {
    await ensureSingleDefault(newConfig._id)
  }

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

  config.apiKey =
    config.apiKey === PASSWORD_REPLACEMENT ? existing.apiKey : config.apiKey

  const updatedConfig: CustomAIProviderConfig = {
    ...existing,
    ...config,
  }

  const db = context.getGlobalDB()
  const { rev } = await db.put(updatedConfig)
  updatedConfig._rev = rev

  if (updatedConfig.isDefault) {
    await ensureSingleDefault(updatedConfig._id)
  }

  await liteLLM.updateModel({
    llmModelId: config.liteLLMModelId,
    provider: config.provider,
    name: config.model,
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
  })

  await liteLLM.syncKeyModels()

  return updatedConfig
}

export async function remove(id: string) {
  const db = context.getGlobalDB()

  const existing = await db.get<CustomAIProviderConfig>(id)
  await db.remove(existing)

  await liteLLM.syncKeyModels()
}

async function getDefault(): Promise<CustomAIProviderConfig | undefined> {
  const allConfigs = await fetch()
  return allConfigs.find(c => c.isDefault)
}

async function getLiteLLMSecretKey() {
  const liteLLMConfig = await configs.getSettingsConfigDoc()
  return liteLLMConfig.config.liteLLM?.secretKey
}

export async function getLLMOrThrow() {
  const aiConfig = await getDefault()
  if (!aiConfig) {
    throw new HTTPError("Chat config not found", 422)
  }

  const secretKey = await getLiteLLMSecretKey()
  if (!secretKey) {
    throw new HTTPError(
      "LiteLLM should be configured. Contact support if the issue persists.",
      422
    )
  }

  const llm = await ai.getChatLLM({
    model: aiConfig.liteLLMModelId,
    baseUrl: environment.LITELLM_URL,
    apiKey: secretKey,
  })
  return llm
}

export async function getLiteLLMModelConfigOrThrow(configId?: string): Promise<{
  modelName: string
  modelId: string
  apiKey: string
  baseUrl: string
}> {
  const aiConfig = configId ? await find(configId) : await getDefault()
  if (!aiConfig) {
    throw new HTTPError("Chat config not found", 400)
  }

  const secretKey = await getLiteLLMSecretKey()
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
