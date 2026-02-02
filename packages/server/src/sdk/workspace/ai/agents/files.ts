import { context, docIds, HTTPError } from "@budibase/backend-core"
import {
  Agent,
  AgentFile,
  AgentFileStatus,
  DocumentType,
  RequiredKeys,
  ToDocCreateMetadata,
  WithRequired,
} from "@budibase/types"

interface CreateAgentFileOptions {
  agentId: string
  filename: string
  mimetype?: string
  size?: number
  uploadedBy: string
  createdRagVersion: number
}

export const createAgentFile = async (
  options: CreateAgentFileOptions
): Promise<AgentFile> => {
  const db = context.getWorkspaceDB()
  const { agentId, filename, mimetype, size, uploadedBy, createdRagVersion } =
    options
  const _id = docIds.generateAgentFileID(agentId)

  const doc: RequiredKeys<ToDocCreateMetadata<AgentFile>> = {
    _id,
    agentId,
    filename,
    mimetype,
    size,
    ragSourceId: _id,
    status: AgentFileStatus.PROCESSING,
    uploadedBy,
    chunkCount: 0,
    createdRagVersion,
    deletedRagVersion: undefined,

    errorMessage: undefined,
    processedAt: undefined,
  }

  const { rev } = await db.put(doc)
  const result: AgentFile = {
    ...doc,
    _rev: rev,
  }
  return result
}

export const updateAgentFile = async (file: AgentFile): Promise<AgentFile> => {
  const db = context.getWorkspaceDB()
  const updated = { ...file }
  const { rev } = await db.put(file)
  updated._rev = rev
  return updated
}

export const getAgentFileOrThrow = async (fileId: string) => {
  const db = context.getWorkspaceDB()
  const file = await db.tryGet<AgentFile>(fileId)
  if (!file || file._deleted) {
    throw new HTTPError("Agent file not found", 404)
  }
  return file
}

export const listAgentFiles = async (agentId: string): Promise<AgentFile[]> => {
  const db = context.getWorkspaceDB()
  const response = await db.allDocs<AgentFile>(
    docIds.getDocParams(DocumentType.AGENT_FILE, agentId, {
      include_docs: true,
    })
  )
  return response.rows
    .map(row => row.doc)
    .filter(file => !!file)
    .filter(file => !file._deleted)
    .filter(file => file.status !== AgentFileStatus.DELETED)
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return timeB - timeA
    })
}

export const removeAgentFile = async (
  agent: WithRequired<Agent, "ragVersion">,
  file: AgentFile
) => {
  const db = context.getWorkspaceDB()
  const updated: AgentFile = {
    ...file,
    status: AgentFileStatus.DELETED,
    deletedRagVersion: agent.ragVersion,
  }
  await db.put(updated)
}
