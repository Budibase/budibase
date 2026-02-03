import { context, db, docIds, HTTPError } from "@budibase/backend-core"
import {
  Agent,
  AgentFile,
  AgentFileStatus,
  DocumentType,
  RequiredKeys,
  ToDocCreateMetadata,
} from "@budibase/types"
import { deleteAgentFileChunks } from "../rag/files"
import { agents } from ".."

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

  const currentRagVersion = await ensureIncreaseRagVersion(agentId)

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
    createdRagVersion: currentRagVersion,

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
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return timeB - timeA
    })
}

export const removeAgentFile = async (agent: Agent, file: AgentFile) => {
  const currentRagVersion = await ensureIncreaseRagVersion(agent._id!)
  if ((file.createdRagVersion ?? 0) === currentRagVersion) {
    await deleteAgentFileChunks(agent, [file.ragSourceId])
  }

  const db = context.getWorkspaceDB()
  await db.remove(file)
}

async function ensureIncreaseRagVersion(agentId: string): Promise<number> {
  let prodVersion = 0
  try {
    const prodWorkspaceId = db.getProdWorkspaceID(
      context.getOrThrowWorkspaceId()
    )
    await context.doInWorkspaceContext(prodWorkspaceId, async () => {
      const prodAgent = await agents.getOrThrow(agentId)
      prodVersion = prodAgent.ragVersion ?? 0
    })
  } catch (error: any) {
    if (error?.status === 404) {
      // ignore if prod workspace/agent does not exist yet
    } else {
      throw error
    }
  }

  const ragVersion = prodVersion + 1

  const agent = await agents.getOrThrow(agentId)
  if (agent.ragVersion !== ragVersion) {
    await agents.update({
      ...agent,
      ragVersion: ragVersion,
    })
  }

  return ragVersion
}
