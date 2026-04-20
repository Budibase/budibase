import { context, docIds } from "@budibase/backend-core"
import type { AgentKnowledgeSourceConnection } from "@budibase/types"

const getConnectionDocId = (sourceType: string, connectionKey: string) =>
  docIds.generateAgentKnowledgeSourceConnectionID(sourceType, connectionKey)

type KnowledgeSourceConnectionInput = Omit<
  AgentKnowledgeSourceConnection,
  "_id" | "_rev" | "createdAt" | "updatedAt" | "sourceType" | "connectionKey"
>

export const getKnowledgeSourceConnection = async <
  T extends AgentKnowledgeSourceConnection = AgentKnowledgeSourceConnection,
>(
  sourceType: string,
  connectionKey: string
): Promise<T | undefined> => {
  const db = context.getWorkspaceDB()
  return db.tryGet<T>(getConnectionDocId(sourceType, connectionKey))
}

export const upsertKnowledgeSourceConnection = async <
  T extends AgentKnowledgeSourceConnection = AgentKnowledgeSourceConnection,
>(
  sourceType: string,
  connectionKey: string,
  data: KnowledgeSourceConnectionInput
) => {
  const db = context.getWorkspaceDB()
  const docId = getConnectionDocId(sourceType, connectionKey)
  const existing = await db.tryGet<T>(docId)
  const now = new Date().toISOString()
  await db.put({
    ...existing,
    ...data,
    _id: docId,
    sourceType,
    connectionKey,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  })
}

export const deleteKnowledgeSourceConnection = async (
  sourceType: string,
  connectionKey: string
) => {
  const db = context.getWorkspaceDB()
  const existing = await db.tryGet<AgentKnowledgeSourceConnection>(
    getConnectionDocId(sourceType, connectionKey)
  )
  if (existing?._id && existing._rev) {
    await db.put({
      ...existing,
      _deleted: true,
    })
  }
}

export const hasKnowledgeSourceConnection = async (
  sourceType: string,
  connectionKey: string
) => {
  const connection = await getKnowledgeSourceConnection(
    sourceType,
    connectionKey
  )
  return !!connection?.refreshToken
}
