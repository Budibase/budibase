import { context, docIds, HTTPError } from "@budibase/backend-core"
import { DocumentType, PASSWORD_REPLACEMENT, VectorDb } from "@budibase/types"

export async function fetch(): Promise<VectorDb[]> {
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<VectorDb>(
    docIds.getDocParams(DocumentType.VECTOR_STORE, undefined, {
      include_docs: true,
    })
  )

  return result.rows.map(row => row.doc).filter((doc): doc is VectorDb => !!doc)
}

export async function find(id: string): Promise<VectorDb | undefined> {
  const db = context.getWorkspaceDB()
  const result = await db.tryGet<VectorDb>(id)
  if (!result || result._deleted) {
    return undefined
  }
  return result
}

export async function create(config: VectorDb): Promise<VectorDb> {
  const db = context.getWorkspaceDB()

  const newConfig: VectorDb = {
    _id: docIds.generateVectorDbID(),
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

  return updated
}

export async function remove(id: string) {
  const db = context.getWorkspaceDB()

  const existing = await db.get<VectorDb>(id)
  await db.remove(existing)
}
