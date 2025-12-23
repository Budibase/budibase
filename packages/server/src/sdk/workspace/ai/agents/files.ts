import { context, docIds, HTTPError } from "@budibase/backend-core"
import {
  Agent,
  AgentFile,
  AgentFileStatus,
  DocumentType,
  RequiredKeys,
} from "@budibase/types"
import { deleteAgentFileChunks } from "../rag"

interface CreateAgentFileOptions {
  agentId: string
  filename: string
  mimetype?: string
  size?: number
  uploadedBy: string
}

export const createAgentFile = async (
  options: CreateAgentFileOptions
): Promise<AgentFile> => {
  const db = context.getWorkspaceDB()
  const { agentId, filename, mimetype, size, uploadedBy } = options
  const _id = docIds.generateAgentFileID(agentId)

  const doc: RequiredKeys<AgentFile> = {
    _id,
    agentId,
    filename,
    mimetype,
    size,
    ragSourceId: _id,
    status: AgentFileStatus.PROCESSING,
    uploadedBy,
    chunkCount: 0,

    _rev: undefined,
    errorMessage: undefined,
    processedAt: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    _deleted: undefined,
  }

  const { rev } = await db.put(doc)
  doc._rev = rev
  return doc
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
    docIds.getDocParams(DocumentType.AGENT_FILE, undefined, {
      include_docs: true,
    })
  )
  return response.rows
    .map(row => row.doc)
    .filter((file): file is AgentFile => !!file && !file._deleted)
    .filter(file => file.agentId === agentId)
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return timeB - timeA
    })
}

export const removeAgentFile = async (agent: Agent, file: AgentFile) => {
  if (!agent.ragConfig) {
    throw new Error("RAG not configured")
  }

  await deleteAgentFileChunks(agent.ragConfig, [file.ragSourceId])
  const db = context.getWorkspaceDB()
  await db.remove(file)
}
