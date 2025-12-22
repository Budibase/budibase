import { context, docIds, HTTPError } from "@budibase/backend-core"
import { DocumentType, PASSWORD_REPLACEMENT, VectorDb } from "@budibase/types"

const sanitizeConfig = (config: VectorDb): VectorDb => {
  if (!config.password) {
    return config
  }
  return {
    ...config,
    password: PASSWORD_REPLACEMENT,
  }
}

export async function fetch(): Promise<VectorDb[]> {
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<VectorDb>(
    docIds.getDocParams(DocumentType.VECTOR_STORE, undefined, {
      include_docs: true,
    })
  )

  return result.rows.map(row => row.doc).filter((doc): doc is VectorDb => !!doc)
}

export async function create(config: VectorDb): Promise<VectorDb> {
  const db = context.getWorkspaceDB()

  const newConfig: VectorDb = {
    _id: docIds.generateVectorDbID(),
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

export async function update(config: VectorDb): Promise<VectorDb> {
  if (!config._id || !config._rev) {
    throw new HTTPError("id and rev required", 400)
  }

  const db = context.getWorkspaceDB()
  const existing = await db.tryGet<VectorDb>(config._id)
  if (!existing) {
    throw new HTTPError("Vector store config not found", 404)
  }

  const password =
    config.password === PASSWORD_REPLACEMENT
      ? existing.password
      : config.password

  const updated: VectorDb = {
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

  const existing = await db.get<VectorDb>(id)
  await db.remove(existing)
}

export async function getDefault(): Promise<VectorDb | undefined> {
  const configs = await fetch()
  return configs.find(config => config.isDefault)
}

async function ensureSingleDefault(config: VectorDb) {
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

export const sanitizeVectorDbConfigs = (configs: VectorDb[]) =>
  configs.map(sanitizeConfig)
