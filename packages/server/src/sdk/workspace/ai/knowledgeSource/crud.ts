import { context, docIds, HTTPError } from "@budibase/backend-core"
import { DocumentType, KnowledgeSource } from "@budibase/types"

const normalizeKnowledgeSourceName = (name: string | undefined) =>
  name?.trim().toLowerCase() || ""

export const fetch = async (
  knowledgeBaseId?: string
): Promise<KnowledgeSource[]> => {
  const db = context.getWorkspaceDB()
  const response = await db.allDocs<KnowledgeSource>(
    docIds.getDocParams(DocumentType.KNOWLEDGE_SOURCE, knowledgeBaseId, {
      include_docs: true,
    })
  )

  return response.rows
    .map(row => row.doc)
    .filter((source): source is KnowledgeSource => !!source && !source._deleted)
}

export const find = async (
  id: string
): Promise<KnowledgeSource | undefined> => {
  const db = context.getWorkspaceDB()
  const result = await db.tryGet<KnowledgeSource>(id)
  if (!result || result._deleted) {
    return undefined
  }
  return result
}

const ensureUniqueNameForKnowledgeBase = async (
  knowledgeBaseId: string,
  name: string,
  currentId?: string
) => {
  const sources = await fetch(knowledgeBaseId)
  const normalizedName = normalizeKnowledgeSourceName(name)
  const duplicate = sources.find(
    source =>
      source._id !== currentId &&
      normalizeKnowledgeSourceName(source.name) === normalizedName
  )

  if (duplicate) {
    throw new HTTPError("Knowledge source name already exists", 400)
  }
}

export const create = async (
  source: Omit<KnowledgeSource, "_id" | "_rev" | "_deleted">
): Promise<KnowledgeSource> => {
  if (!source.knowledgeBaseId) {
    throw new HTTPError("knowledgeBaseId is required", 400)
  }

  await ensureUniqueNameForKnowledgeBase(source.knowledgeBaseId, source.name)

  const db = context.getWorkspaceDB()
  const created: KnowledgeSource = {
    _id: docIds.generateKnowledgeSourceID(source.knowledgeBaseId),
    ...source,
    name: source.name.trim(),
  }

  const { rev } = await db.put(created)
  created._rev = rev
  return created
}

export const update = async (
  source: KnowledgeSource
): Promise<KnowledgeSource> => {
  if (!source._id || !source._rev) {
    throw new HTTPError("id and rev required", 400)
  }
  if (!source.knowledgeBaseId) {
    throw new HTTPError("knowledgeBaseId is required", 400)
  }

  const db = context.getWorkspaceDB()
  const existing = await db.tryGet<KnowledgeSource>(source._id)
  if (!existing || existing._deleted) {
    throw new HTTPError("Knowledge source not found", 404)
  }

  const updated: KnowledgeSource = {
    ...existing,
    ...source,
    name: source.name.trim(),
  }

  await ensureUniqueNameForKnowledgeBase(
    updated.knowledgeBaseId,
    updated.name,
    updated._id
  )

  const { rev } = await db.put(updated)
  updated._rev = rev
  return updated
}

export const remove = async (id: string) => {
  const db = context.getWorkspaceDB()
  const source = await db.tryGet<KnowledgeSource>(id)
  if (!source || source._deleted) {
    throw new HTTPError("Knowledge source not found", 404)
  }
  await db.remove(source)
}
