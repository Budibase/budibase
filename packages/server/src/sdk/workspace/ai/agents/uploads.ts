import { context, docIds, objectStore } from "@budibase/backend-core"
import { AgentFile, AgentFileStatus } from "@budibase/types"
import { ObjectStoreBuckets } from "../../../../constants"
import { enqueueAgentFileIngestion } from "../rag/queue"
import { createAgentFile, updateAgentFile } from "./files"

interface UploadAgentFileInput {
  agentId: string
  filename: string
  mimetype?: string
  size?: number
  buffer: Buffer
  uploadedBy: string
}

export const uploadAgentFile = async (
  input: UploadAgentFileInput
): Promise<AgentFile> => {
  const workspaceId = context.getOrThrowWorkspaceId()

  const fileId = docIds.generateAgentFileID(input.agentId)
  const objectStoreKey = `${workspaceId}/ai/agents/${input.agentId}/files/${fileId}/${input.filename}`

  await objectStore.upload({
    bucket: ObjectStoreBuckets.APPS,
    filename: objectStoreKey,
    body: input.buffer,
    type: input.mimetype,
  })

  const agentFile = await createAgentFile({
    id: fileId,
    agentId: input.agentId,
    filename: input.filename,
    mimetype: input.mimetype,
    objectStoreKey: objectStoreKey,
    size: input.size ?? input.buffer.byteLength,
    uploadedBy: input.uploadedBy,
  })

  try {
    await enqueueAgentFileIngestion({
      workspaceId,
      agentId: input.agentId,
      fileId: agentFile._id!,
      objectStoreKey,
    })

    return agentFile
  } catch (error: any) {
    agentFile.status = AgentFileStatus.FAILED
    agentFile.errorMessage = error?.message || "Failed to process uploaded file"
    agentFile.chunkCount = 0
    await updateAgentFile(agentFile)
    throw error
  }
}
