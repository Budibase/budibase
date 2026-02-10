import { context, docIds, objectStore } from "@budibase/backend-core"
import { AgentFile } from "@budibase/types"
import { ObjectStoreBuckets } from "../../../../constants"
import { enqueueAgentFileIngestion } from "../rag/queue"
import { createAgentFile } from "./files"

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

  await enqueueAgentFileIngestion({
    workspaceId,
    agentId: input.agentId,
    fileId: agentFile._id!,
    objectStoreKey,
  })

  return agentFile
}
