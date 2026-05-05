import { context, docIds } from "@budibase/backend-core"
import {
  DocumentType,
  prefixed,
  type AgentKnowledgeSourceConnection,
} from "@budibase/types"

type CreateKnowledgeSourceConnectionInput = Omit<
  AgentKnowledgeSourceConnection,
  "_id" | "_rev" | "createdAt" | "updatedAt"
>

type UpdateKnowledgeSourceConnectionInput = Partial<
  Omit<
    AgentKnowledgeSourceConnection,
    "_id" | "_rev" | "createdAt" | "updatedAt" | "sourceType"
  >
>

export const getKnowledgeSourceConnection = async <
  T extends AgentKnowledgeSourceConnection = AgentKnowledgeSourceConnection,
>(
  id: string
): Promise<T | undefined> => {
  if (!id) {
    return
  }
  const db = context.getWorkspaceDB()
  return db.tryGet<T>(id)
}

export const createKnowledgeSourceConnection = async <
  T extends AgentKnowledgeSourceConnection = AgentKnowledgeSourceConnection,
>(
  data: CreateKnowledgeSourceConnectionInput
): Promise<T> => {
  const db = context.getWorkspaceDB()

  const doc = {
    ...data,
    _id: docIds.generateAgentKnowledgeSourceConnectionID(),
  } as T
  await db.put(doc)
  return doc
}

export const updateKnowledgeSourceConnection = async <
  T extends AgentKnowledgeSourceConnection = AgentKnowledgeSourceConnection,
>(
  id: string,
  patch: UpdateKnowledgeSourceConnectionInput
): Promise<T | undefined> => {
  const db = context.getWorkspaceDB()
  const existing = await db.tryGet<T>(id)
  if (!existing?._id) {
    return
  }

  const next = {
    ...existing,
    ...patch,
    _id: existing._id,
    _rev: existing._rev,
    createdAt: existing.createdAt,
  } as T

  await db.put(next)
  return next
}

export const deleteKnowledgeSourceConnection = async (id: string) => {
  const db = context.getWorkspaceDB()
  if (!docIds.isType(id, DocumentType.AGENT_KNOWLEDGE_SOURCE_CONNECTION)) {
    throw new Error("Invalid knowledge source connection ID")
  }
  const existing = await db.tryGet<AgentKnowledgeSourceConnection>(id)
  if (existing?._id && existing._rev) {
    await db.put({
      ...existing,
      _deleted: true,
    })
  }
}

export const listKnowledgeSourceConnections = async () => {
  const db = context.getWorkspaceDB()
  const response = await db.allDocs<AgentKnowledgeSourceConnection>({
    include_docs: true,
    startkey: prefixed(DocumentType.AGENT_KNOWLEDGE_SOURCE_CONNECTION),
    endkey: `${prefixed(DocumentType.AGENT_KNOWLEDGE_SOURCE_CONNECTION)}\ufff0`,
  })

  return response.rows
    .map(row => row.doc)
    .filter(
      (doc): doc is AgentKnowledgeSourceConnection => !!doc && !doc._deleted
    )
}
