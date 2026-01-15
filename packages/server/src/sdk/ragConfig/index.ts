import { context, docIds, HTTPError } from "@budibase/backend-core"
import { DocumentType, RagConfig } from "@budibase/types"

export async function fetch(): Promise<RagConfig[]> {
  const db = context.getGlobalDB()
  const result = await db.allDocs<RagConfig>(
    docIds.getDocParams(DocumentType.RAG_CONFIG, undefined, {
      include_docs: true,
    })
  )

  return result.rows
    .map(row => row.doc)
    .filter((doc): doc is RagConfig => !!doc)
}

export async function find(id: string): Promise<RagConfig | undefined> {
  const db = context.getGlobalDB()
  const result = await db.tryGet<RagConfig>(id)
  if (!result || result._deleted) {
    return undefined
  }
  return result
}

export async function create(config: RagConfig): Promise<RagConfig> {
  const db = context.getGlobalDB()

  const newConfig: RagConfig = {
    _id: docIds.generateRagConfigID(),
    name: config.name,
    embeddingModel: config.embeddingModel,
    vectorDb: config.vectorDb,
    ragMinDistance: config.ragMinDistance,
    ragTopK: config.ragTopK,
  }

  const { rev } = await db.put(newConfig)
  newConfig._rev = rev

  return newConfig
}

export async function update(config: RagConfig): Promise<RagConfig> {
  if (!config._id || !config._rev) {
    throw new HTTPError("id and rev required", 400)
  }

  const db = context.getGlobalDB()
  const existing = await db.tryGet<RagConfig>(config._id)
  if (!existing) {
    throw new HTTPError("RAG config not found", 404)
  }

  const updated: RagConfig = {
    ...existing,
    ...config,
  }

  const { rev } = await db.put(updated)
  updated._rev = rev

  return updated
}

export async function remove(id: string) {
  const db = context.getGlobalDB()

  const existing = await db.get<RagConfig>(id)
  await db.remove(existing)
}
