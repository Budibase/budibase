import { context, docIds, HTTPError, objectStore } from "@budibase/backend-core"
import { KnowledgeBaseFile, KnowledgeBaseFileStatus } from "@budibase/types"
import { ObjectStoreBuckets } from "../../../../constants"
import { enqueueRagFileIngestion } from "../rag/queue"
import { createKnowledgeBaseFile, updateKnowledgeBaseFile } from "./files"
import { find as findKnowledgeBase } from "./crud"

interface UploadKnowledgeBaseFileInput {
  knowledgeBaseId: string
  filename: string
  mimetype?: string
  size?: number
  buffer: Buffer
  uploadedBy: string
  externalSourceId?: string
}

const buildKnowledgeBaseFileObjectStoreKey = (
  workspaceId: string,
  knowledgeBaseId: string,
  fileId: string,
  filename: string
) =>
  `${workspaceId}/ai/knowledge-bases/${knowledgeBaseId}/files/${fileId}/${filename}`

export const uploadKnowledgeBaseFile = async (
  input: UploadKnowledgeBaseFileInput
): Promise<KnowledgeBaseFile> => {
  const workspaceId = context.getOrThrowWorkspaceId()
  const knowledgeBase = await findKnowledgeBase(input.knowledgeBaseId)
  if (!knowledgeBase) {
    throw new HTTPError("Knowledge base not found", 404)
  }

  const fileId = docIds.generateKnowledgeBaseFileID(input.knowledgeBaseId)
  const objectStoreKey = buildKnowledgeBaseFileObjectStoreKey(
    workspaceId,
    input.knowledgeBaseId,
    fileId,
    input.filename
  )

  try {
    await objectStore.upload({
      bucket: ObjectStoreBuckets.APPS,
      filename: objectStoreKey,
      body: input.buffer,
      type: input.mimetype,
    })

    const knowledgeBaseFile = await createKnowledgeBaseFile({
      id: fileId,
      knowledgeBaseId: input.knowledgeBaseId,
      filename: input.filename,
      mimetype: input.mimetype,
      objectStoreKey,
      size: input.size ?? input.buffer.byteLength,
      uploadedBy: input.uploadedBy,
      externalSourceId: input.externalSourceId,
    })

    try {
      await enqueueRagFileIngestion({
        workspaceId,
        knowledgeBaseId: input.knowledgeBaseId,
        fileId: knowledgeBaseFile._id!,
        objectStoreKey,
      })

      return knowledgeBaseFile
    } catch (error: any) {
      knowledgeBaseFile.status = KnowledgeBaseFileStatus.FAILED
      knowledgeBaseFile.errorMessage =
        error?.message || "Failed to process uploaded file"
      await updateKnowledgeBaseFile(knowledgeBaseFile)
      throw error
    }
  } catch (error: any) {
    await objectStore
      .deleteFile(ObjectStoreBuckets.APPS, objectStoreKey)
      .catch(() => {
        // Ignore, it might not exist
      })
    throw error
  }
}
