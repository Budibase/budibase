import { context, docIds, HTTPError } from "@budibase/backend-core"
import {
  VectorStore,
  DocumentType,
  PASSWORD_REPLACEMENT,
} from "@budibase/types"

const sanitizeConfig = (config: VectorStore): VectorStore => {
  if (!config.password) {
    return config
  }
  return {
    ...config,
    password: PASSWORD_REPLACEMENT,
  }
}

export async function fetch(): Promise<VectorStore[]> {
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<VectorStore>(
    docIds.getDocParams(DocumentType.VECTOR_STORE, undefined, {
      include_docs: true,
    })
  )

  return result.rows
    .map(row => row.doc)
    .filter((doc): doc is VectorStore => !!doc)
}

export async function create(config: VectorStore): Promise<VectorStore> {
  const db = context.getWorkspaceDB()

  const newConfig: VectorStore = {
    _id: docIds.generateVectorStoreID(),
    isDefault: config.isDefault ?? false,
    name: config.name,
    provider: config.provider,
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
  }

  const { rev } = await db.put(newConfig)
  newConfig._rev = rev

  await ensureSingleDefault(newConfig)
  return newConfig
}

export async function update(config: VectorStore): Promise<VectorStore> {
  if (!config._id || !config._rev) {
    throw new HTTPError("id and rev required", 400)
  }

  const db = context.getWorkspaceDB()
  const existing = await db.tryGet<VectorStore>(config._id)
  if (!existing) {
    throw new HTTPError("Vector store config not found", 404)
  }

  const password =
    config.password === PASSWORD_REPLACEMENT
      ? existing.password
      : config.password

  const updated: VectorStore = {
    ...existing,
    ...config,
    password,
  }

  const { rev } = await db.put(updated)
  updated._rev = rev

  await ensureSingleDefault(updated)
  return updated
}

export async function remove(id: string) {
  const db = context.getWorkspaceDB()

  const existing = await db.get<VectorStore>(id)
  await db.remove(existing)
}

export async function getDefault(): Promise<VectorStore | undefined> {
  const configs = await fetch()
  return configs.find(config => config.isDefault)
}

async function ensureSingleDefault(config: VectorStore) {
  if (!config.isDefault) {
    return
  }
  const configs = await fetch()
  const db = context.getWorkspaceDB()
  const updates = configs
    .filter(existing => existing._id !== config._id && existing.isDefault)
    .map(existing => ({ ...existing, isDefault: false }))

  if (updates.length > 0) {
    await db.bulkDocs(updates)
  }
}

export const sanitizeVectorStoreConfigs = (configs: VectorStore[]) =>
  configs.map(sanitizeConfig)
