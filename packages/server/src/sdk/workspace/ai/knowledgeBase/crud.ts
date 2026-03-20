import { context, docIds, HTTPError } from "@budibase/backend-core"
import {
  AIConfigType,
  DocumentType,
  KnowledgeBase,
  RetrievalBackend,
} from "@budibase/types"
import * as configSdk from "../configs"
import * as knowledgeBaseFileSdk from "./files"
import * as vectorDbSdk from "../vectorDb"
import { utils } from "@budibase/shared-core"

const normalizeKnowledgeBaseName = (name: string | undefined) =>
  name?.trim().toLowerCase() || ""

const validateReferences = async ({
  retrievalBackend,
  embeddingModel,
  vectorDb,
}: Pick<KnowledgeBase, "retrievalBackend"> &
  Partial<Pick<KnowledgeBase, "embeddingModel" | "vectorDb">>) => {
  switch (retrievalBackend) {
    case RetrievalBackend.MANAGED_FILE_SEARCH:
      return
    case RetrievalBackend.BUDIBASE_VECTOR: {
      if (!embeddingModel || !vectorDb) {
        throw new HTTPError(
          "Embedding model and vector store are required for vector-based knowledge bases",
          400
        )
      }

      const embeddingConfig = await configSdk.find(embeddingModel)
      if (!embeddingConfig) {
        throw new HTTPError("Embedding model not found", 404)
      }
      if (embeddingConfig.configType !== AIConfigType.EMBEDDINGS) {
        throw new HTTPError("Embedding model must be an embeddings config", 400)
      }

      const vectorDbConfig = await vectorDbSdk.find(vectorDb)
      if (!vectorDbConfig) {
        throw new HTTPError("Vector store config not found", 404)
      }
      return
    }
    default: {
      throw utils.unreachable(retrievalBackend, {
        message: "Unsupported retrieval backend",
      })
    }
  }
}

const normalizeKnowledgeBase = (
  source: KnowledgeBase,
  id: string,
  rev?: string
): KnowledgeBase => {
  switch (source.retrievalBackend) {
    case RetrievalBackend.BUDIBASE_VECTOR:
      return {
        _id: id,
        ...(rev ? { _rev: rev } : {}),
        name: source.name.trim(),
        retrievalBackend: RetrievalBackend.BUDIBASE_VECTOR,
        embeddingModel: source.embeddingModel,
        vectorDb: source.vectorDb,
      }
    case RetrievalBackend.MANAGED_FILE_SEARCH:
      return {
        _id: id,
        ...(rev ? { _rev: rev } : {}),
        name: source.name.trim(),
        retrievalBackend: RetrievalBackend.MANAGED_FILE_SEARCH,
        managedRetrievalProvider: source.managedRetrievalProvider,
        managedRetrievalIndexId: source.managedRetrievalIndexId,
      }
    default: {
      const _exhaustive: never = source
      throw new HTTPError(`Unsupported retrieval backend: ${_exhaustive}`, 400)
    }
  }
}

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

export async function findByEmbeddingModel(
  embeddingModelId: string
): Promise<KnowledgeBase[]> {
  const knowledgeBases = await fetch()
  return knowledgeBases.filter(
    knowledgeBase => knowledgeBase.embeddingModel === embeddingModelId
  )
}

export async function findByVectorDb(
  vectorDbId: string
): Promise<KnowledgeBase[]> {
  const knowledgeBases = await fetch()
  return knowledgeBases.filter(
    knowledgeBase => knowledgeBase.vectorDb === vectorDbId
  )
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

export async function create(config: KnowledgeBase): Promise<KnowledgeBase> {
  const db = context.getWorkspaceDB()
  await validateReferences(config)
  await ensureUniqueName(config.name)

  const newConfig = normalizeKnowledgeBase(
    config,
    docIds.generateKnowledgeBaseID()
  )

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

  const merged = {
    ...existing,
    ...config,
  }
  const updated = normalizeKnowledgeBase(
    merged as KnowledgeBase,
    existing._id!,
    existing._rev
  )

  const referencesChanged =
    existing.embeddingModel !== updated.embeddingModel ||
    existing.vectorDb !== updated.vectorDb ||
    existing.retrievalBackend !== updated.retrievalBackend

  if (referencesChanged) {
    const files = await knowledgeBaseFileSdk.listKnowledgeBaseFiles(config._id)
    if (files.length > 0) {
      throw new HTTPError(
        "Embedding model and vector database cannot be changed after files are added",
        400
      )
    }
  }

  await validateReferences(updated)
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
}
