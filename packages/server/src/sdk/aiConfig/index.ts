import { context, docIds } from "@budibase/backend-core"
import {
  CustomAIProviderConfig,
  DocumentType,
  PASSWORD_REPLACEMENT,
} from "@budibase/types"
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

export async function getDefault(): Promise<
  CustomAIProviderConfig | undefined
> {
  const allConfigs = await fetch()
  return allConfigs.find(c => c.isDefault)
}

export async function find(id: string): Promise<CustomAIProviderConfig> {
  const db = context.getGlobalDB()
  const result = await db.get<CustomAIProviderConfig>(id)

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

export async function create(
  config: CustomAIProviderConfig
): Promise<CustomAIProviderConfig> {
  const db = context.getGlobalDB()

  const liteLLMKey = await liteLLM.generateKey(config.name)
  {
    const newConfig: CustomAIProviderConfig = {
      _id: docIds.generateAIConfigID(),
      isDefault: config.isDefault ?? false,
      name: config.name,
      baseUrl: config.baseUrl,
      model: config.model,
      liteLLMKey,
      apiKey: config.apiKey,
    }

    const { rev } = await db.put(newConfig)
    newConfig._rev = rev

    if (newConfig.isDefault) {
      await ensureSingleDefault(newConfig._id)
    }

    return newConfig
  }
}

export async function update(
  config: CustomAIProviderConfig
): Promise<CustomAIProviderConfig> {
  const existing = await find(config._id!)

  const apiKey =
    config.apiKey === PASSWORD_REPLACEMENT ? existing.apiKey : config.apiKey

  const updatedConfig: CustomAIProviderConfig = {
    ...existing,
    ...config,
    apiKey,
  }

  const db = context.getGlobalDB()
  const { rev } = await db.put(updatedConfig)
  updatedConfig._rev = rev

  if (updatedConfig.isDefault) {
    await ensureSingleDefault(updatedConfig._id)
  }

  await liteLLM.updateKey(existing.liteLLMKey, updatedConfig.name)

  return updatedConfig
}

export async function remove(id: string) {
  const db = context.getGlobalDB()

  const existing = await db.get<CustomAIProviderConfig>(id)
  await db.remove(existing)
  await liteLLM.removeKey(existing.liteLLMKey)
}
