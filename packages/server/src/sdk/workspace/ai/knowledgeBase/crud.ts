import { context, docIds, HTTPError } from "@budibase/backend-core"
import {
  CreateKnowledgeBaseRequest,
  DocumentType,
  GeminiKnowledgeBase,
  KnowledgeBase,
  KnowledgeBaseType,
  UpdateKnowledgeBaseRequest,
} from "@budibase/types"
import {
  createGeminiFileStore,
  deleteGeminiVectorStore,
} from "./geminiFileStore"
import { syncKeyVectorStores } from "../configs/litellm"
import { utils } from "@budibase/shared-core"

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

  let newConfig: KnowledgeBase
  let createdGeminiStoreId: string | undefined
  switch (knowledgeBaseType) {
    case KnowledgeBaseType.GEMINI: {
      const googleFileStoreId = await createGeminiFileStore(config.name.trim())
      createdGeminiStoreId = googleFileStoreId
      newConfig = {
        _id: docIds.generateKnowledgeBaseID(),
        name: config.name.trim(),
        type: KnowledgeBaseType.GEMINI,
        config: {
          googleFileStoreId,
        },
      } satisfies GeminiKnowledgeBase
      break
    }
    default:
      throw utils.unreachable(knowledgeBaseType)
  }

  try {
    const { rev } = await db.put(newConfig)
    newConfig._rev = rev
  } catch (error) {
    if (createdGeminiStoreId) {
      await deleteGeminiVectorStore(createdGeminiStoreId).catch(
        cleanupError => {
          console.log(
            "Failed to cleanup Gemini vector store after knowledge base create failure",
            cleanupError
          )
        }
      )
    }
    throw error
  }
  await syncKeyVectorStores()

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

  let updated: KnowledgeBase
  const knowledgeBaseType = config.type
  switch (knowledgeBaseType) {
    case KnowledgeBaseType.GEMINI: {
      if (knowledgeBaseType !== existing.type) {
        throw new HTTPError("Knowledge base type cannot be changed", 400)
      }
      updated = {
        ...existing,
        ...config,
        type: KnowledgeBaseType.GEMINI,
        config: { googleFileStoreId: existing.config.googleFileStoreId },
      } satisfies GeminiKnowledgeBase
      break
    }
    default:
      throw utils.unreachable(knowledgeBaseType)
  }

  if (
    updated.type === KnowledgeBaseType.GEMINI &&
    !updated.config.googleFileStoreId
  ) {
    throw new HTTPError(
      "Google knowledge base is missing its file store configuration",
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
  await db.remove(existing)
  await syncKeyVectorStores()
}
