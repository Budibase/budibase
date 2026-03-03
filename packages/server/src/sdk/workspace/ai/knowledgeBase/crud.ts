import { context, docIds, HTTPError } from "@budibase/backend-core"
import { DocumentType, KnowledgeBase } from "@budibase/types"

export async function fetch(): Promise<KnowledgeBase[]> {
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<KnowledgeBase>(
    docIds.getDocParams(DocumentType.KNOWLEDGE_BASE, undefined, {
      include_docs: true,
    })
  )

  return result.rows
    .map(row => row.doc)
    .filter((doc): doc is KnowledgeBase => !!doc)
}

export async function find(id: string): Promise<KnowledgeBase | undefined> {
  const db = context.getWorkspaceDB()
  const result = await db.tryGet<KnowledgeBase>(id)
  if (!result || result._deleted) {
    return undefined
  }
  return result
}

export async function create(config: KnowledgeBase): Promise<KnowledgeBase> {
  const db = context.getWorkspaceDB()

  const newConfig: KnowledgeBase = {
    _id: docIds.generateKnowledgeBaseID(),
    name: config.name,
    embeddingModel: config.embeddingModel,
    vectorDb: config.vectorDb,
  }

  const { rev } = await db.put(newConfig)
  newConfig._rev = rev

  return newConfig
}

export async function update(config: KnowledgeBase): Promise<KnowledgeBase> {
  if (!config._id || !config._rev) {
    throw new HTTPError("id and rev required", 400)
  }

  const db = context.getWorkspaceDB()
  const existing = await db.tryGet<KnowledgeBase>(config._id)
  if (!existing) {
    throw new HTTPError("Knowledge base not found", 404)
  }

  const updated: KnowledgeBase = {
    ...existing,
    ...config,
  }

  const { rev } = await db.put(updated)
  updated._rev = rev

  return updated
}

export async function remove(id: string) {
  const db = context.getWorkspaceDB()

  const existing = await db.get<KnowledgeBase>(id)
  await db.remove(existing)
}
