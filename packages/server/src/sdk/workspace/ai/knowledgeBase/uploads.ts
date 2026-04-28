import { context, docIds, HTTPError, objectStore } from "@budibase/backend-core"
import {
  KnowledgeBaseFile,
  KnowledgeBaseFileSource,
  KnowledgeBaseFileStatus,
} from "@budibase/types"
import { ObjectStoreBuckets } from "../../../../constants"
import { enqueueRagFileIngestion } from "../rag/queue"
import {
  createKnowledgeBaseFile,
  getKnowledgeBaseFileOrThrow,
  updateKnowledgeBaseFile,
} from "./files"
import { find as findKnowledgeBase } from "./crud"

interface UploadKnowledgeBaseFileInput {
  knowledgeBaseId: string
  source?: KnowledgeBaseFileSource
  filename: string
  mimetype?: string
  size?: number
  buffer: Buffer
  uploadedBy: string
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
  const startedAtMs = Date.now()
  console.log("Starting knowledge base file upload", {
    workspaceId,
    knowledgeBaseId: input.knowledgeBaseId,
    fileId,
    filename: input.filename,
    mimetype: input.mimetype,
    size: input.size ?? input.buffer.byteLength,
    sourceType: input.source?.type,
    objectStoreKey,
  })

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
      source: input.source,
      filename: input.filename,
      mimetype: input.mimetype,
      objectStoreKey,
      size: input.size ?? input.buffer.byteLength,
      uploadedBy: input.uploadedBy,
    })

    try {
      await enqueueRagFileIngestion({
        workspaceId,
        knowledgeBaseId: input.knowledgeBaseId,
        fileId: knowledgeBaseFile._id!,
        objectStoreKey,
      })
      console.log("Completed knowledge base file upload and queued ingestion", {
        workspaceId,
        knowledgeBaseId: input.knowledgeBaseId,
        fileId: knowledgeBaseFile._id,
        objectStoreKey,
        durationMs: Date.now() - startedAtMs,
      })

      return knowledgeBaseFile
    } catch (error: any) {
      knowledgeBaseFile.status = KnowledgeBaseFileStatus.FAILED
      knowledgeBaseFile.errorMessage =
        error?.message || "Failed to process uploaded file"
      await updateKnowledgeBaseFile(knowledgeBaseFile)
      console.error("Failed to enqueue knowledge base file ingestion", {
        workspaceId,
        knowledgeBaseId: input.knowledgeBaseId,
        fileId: knowledgeBaseFile._id,
        objectStoreKey,
        durationMs: Date.now() - startedAtMs,
        error,
      })
      throw error
    }
  } catch (error: any) {
    console.error("Failed to upload knowledge base file", {
      workspaceId,
      knowledgeBaseId: input.knowledgeBaseId,
      fileId,
      filename: input.filename,
      objectStoreKey,
      durationMs: Date.now() - startedAtMs,
      error,
    })
    await objectStore
      .deleteFile(ObjectStoreBuckets.APPS, objectStoreKey)
      .catch(() => {
        // Ignore, it might not exist
      })
    throw error
  }
}

export const retryKnowledgeBaseFileIngestion = async (fileId: string) => {
  const workspaceId = context.getOrThrowWorkspaceId()
  const file = await getKnowledgeBaseFileOrThrow(fileId)
  const startedAtMs = Date.now()

  if (!file.objectStoreKey) {
    throw new HTTPError("Knowledge base file does not have an object key", 400)
  }
  if (file.status !== KnowledgeBaseFileStatus.FAILED) {
    throw new HTTPError("Knowledge base file is not in failed state", 400)
  }

  file.status = KnowledgeBaseFileStatus.PROCESSING
  file.errorMessage = undefined
  file.processedAt = undefined
  await updateKnowledgeBaseFile(file)
  console.log("Retrying knowledge base file ingestion", {
    workspaceId,
    knowledgeBaseId: file.knowledgeBaseId,
    fileId,
    objectStoreKey: file.objectStoreKey,
  })

  try {
    await enqueueRagFileIngestion({
      workspaceId,
      knowledgeBaseId: file.knowledgeBaseId,
      fileId,
      objectStoreKey: file.objectStoreKey,
    })
    console.log("Requeued knowledge base file ingestion", {
      workspaceId,
      knowledgeBaseId: file.knowledgeBaseId,
      fileId,
      durationMs: Date.now() - startedAtMs,
    })

    return file
  } catch (error: any) {
    file.status = KnowledgeBaseFileStatus.FAILED
    file.errorMessage =
      error?.message || "Failed to requeue knowledge base file ingestion"
    await updateKnowledgeBaseFile(file)
    console.error("Failed to requeue knowledge base file ingestion", {
      workspaceId,
      knowledgeBaseId: file.knowledgeBaseId,
      fileId,
      durationMs: Date.now() - startedAtMs,
      error,
    })
    throw error
  }
}
