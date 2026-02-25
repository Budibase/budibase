import {
  context,
  db,
  docIds,
  HTTPError,
  objectStore,
} from "@budibase/backend-core"
import {
  Agent,
  AgentFile,
  AgentFileStatus,
  DocumentType,
  RequiredKeys,
  ToDocCreateMetadata,
} from "@budibase/types"
import { deleteAgentFileChunks } from "../rag/files"
import { ObjectStoreBuckets } from "../../../../constants"

interface CreateAgentFileOptions {
  id: string
  agentId: string
  filename: string
  mimetype?: string
  size?: number
  uploadedBy: string
  objectStoreKey: string
}

export const createAgentFile = async (
  options: CreateAgentFileOptions
): Promise<AgentFile> => {
  const db = context.getWorkspaceDB()
  const { id, agentId, filename, mimetype, size, uploadedBy, objectStoreKey } =
    options
  const _id = id || docIds.generateAgentFileID(agentId)
  if (!docIds.isAgentFileID(_id)) {
    throw new Error(`Id ${_id} is not valid for an agent file`)
  }

  const doc: RequiredKeys<ToDocCreateMetadata<AgentFile>> = {
    _id,
    agentId,
    filename,
    mimetype,
    size,
    objectStoreKey,
    ragSourceId: _id,
    status: AgentFileStatus.PROCESSING,
    uploadedBy,
    chunkCount: 0,
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
  let isFileInProduction = false

  try {
    const prodWorkspaceId = db.getProdWorkspaceID(
      context.getOrThrowWorkspaceId()
    )
    await context.doInWorkspaceContext(prodWorkspaceId, async () => {
      await getAgentFileOrThrow(file._id!)

      isFileInProduction = true
    })
  } catch (error: any) {
    if (error?.status === 404) {
      // ignore if prod version does not exist yet
    } else {
      throw error
    }
  }
  if (!isFileInProduction) {
    await deleteAgentFileChunks(agent, [file.ragSourceId])
  }

  if (file.objectStoreKey) {
    try {
      await objectStore.deleteFile(ObjectStoreBuckets.APPS, file.objectStoreKey)
    } catch (error) {
      console.log("Failed to delete agent file from object store", error)
    }
  }

  await context.getWorkspaceDB().remove(file)
}
