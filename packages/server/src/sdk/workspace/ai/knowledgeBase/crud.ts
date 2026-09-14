import { context, docIds, HTTPError } from "@budibase/backend-core"
import {
  CreateKnowledgeBaseRequest,
  DocumentType,
  KnowledgeBase,
  KnowledgeBaseType,
  UpdateKnowledgeBaseRequest,
} from "@budibase/types"
import { createKnowledgeStore, deleteKnowledgeStore } from "./provider"
import { syncKeyVectorStores } from "../configs/litellm"

const normalizeKnowledgeBaseName = (name: string | undefined) =>
  name?.trim().toLowerCase() || ""

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

const ensureUniqueName = async (
  name: string,
  currentId?: string
): Promise<void> => {
  const knowledgeBases = await fetch()
  const normalizedName = normalizeKnowledgeBaseName(name)
  const duplicate = knowledgeBases.find(
    knowledgeBase =>
      knowledgeBase._id !== currentId &&
      normalizeKnowledgeBaseName(knowledgeBase.name) === normalizedName
  )

  if (duplicate) {
    throw new HTTPError("Knowledge base name already exists", 400)
  }
}

export async function create(
  config: CreateKnowledgeBaseRequest
): Promise<KnowledgeBase> {
  const db = context.getWorkspaceDB()
  const knowledgeBaseType = config.type
  await ensureUniqueName(config.name)

  const newConfig: KnowledgeBase = {
    ...(await createKnowledgeStore({
      name: config.name.trim(),
      type: knowledgeBaseType,
    })),
    _id: docIds.generateKnowledgeBaseID(),
  }

  try {
    const { rev } = await db.put(newConfig)
    newConfig._rev = rev
  } catch (error) {
    await deleteKnowledgeStore(newConfig).catch(cleanupError => {
      console.log(
        "Failed to clean up knowledge store after creation failed",
        cleanupError
      )
    })
    throw error
  }
  if (newConfig.type === KnowledgeBaseType.GEMINI) {
    await syncKeyVectorStores()
  }

  return newConfig
}

export async function update(
  config: UpdateKnowledgeBaseRequest
): Promise<KnowledgeBase> {
  if (!config._id || !config._rev) {
    throw new HTTPError("id and rev required", 400)
  }

  const db = context.getWorkspaceDB()
  const existing = await db.tryGet<KnowledgeBase>(config._id)
  if (!existing) {
    throw new HTTPError("Knowledge base not found", 404)
  }

  if (config.type !== existing.type) {
    throw new HTTPError("Knowledge base type cannot be changed", 400)
  }
  const updated: KnowledgeBase = { ...existing, name: config.name }

  const storeId =
    updated.type === KnowledgeBaseType.AZURE
      ? updated.config.vectorStoreId
      : updated.config.googleFileStoreId
  if (!storeId) {
    throw new HTTPError(
      "Knowledge base is missing its file store configuration",
      400
    )
  }

  await ensureUniqueName(updated.name, updated._id)
  updated.name = updated.name.trim()

  const { rev } = await db.put(updated)
  updated._rev = rev

  return updated
}

export async function remove(id: string) {
  const db = context.getWorkspaceDB()

  const existing = await db.get<KnowledgeBase>(id)
  if (existing.type === KnowledgeBaseType.AZURE) {
    await deleteKnowledgeStore(existing)
  }
  await db.remove(existing)
  if (existing.type === KnowledgeBaseType.GEMINI) {
    await syncKeyVectorStores()
  }
}
