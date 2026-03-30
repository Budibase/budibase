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
  buffer?: Buffer
  sourceUrl?: string
  uploadedBy: string
  ragSourceId?: string
  externalSourceId?: string
  persistInObjectStore?: boolean
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
  if (input.buffer && input.persistInObjectStore === false) {
    throw new HTTPError(
      "buffer uploads must be persisted to object storage before ingestion",
      400
    )
  }
  const persistInObjectStore = input.persistInObjectStore !== false

  if (persistInObjectStore && !input.buffer) {
    throw new HTTPError("buffer is required when persistence is enabled", 400)
  }

  if (!persistInObjectStore && !input.sourceUrl) {
    throw new HTTPError("sourceUrl is required when persistence is disabled", 400)
  }

  try {
    if (persistInObjectStore) {
      await objectStore.upload({
        bucket: ObjectStoreBuckets.APPS,
        filename: objectStoreKey,
        body: input.buffer!,
        type: input.mimetype,
      })
    }

    const knowledgeBaseFile = await createKnowledgeBaseFile({
      id: fileId,
      knowledgeBaseId: input.knowledgeBaseId,
      filename: input.filename,
      mimetype: input.mimetype,
      objectStoreKey: persistInObjectStore ? objectStoreKey : "",
      size: persistInObjectStore
        ? input.size ?? input.buffer!.byteLength
        : input.size,
      uploadedBy: input.uploadedBy,
      ragSourceId: input.ragSourceId,
      externalSourceId: input.externalSourceId,
    })

    try {
      const ingestionJob = {
        workspaceId,
        knowledgeBaseId: input.knowledgeBaseId,
        fileId: knowledgeBaseFile._id!,
        ...(persistInObjectStore
          ? { objectStoreKey }
          : { sourceUrl: input.sourceUrl! }),
      }

      await enqueueRagFileIngestion(ingestionJob)

      return knowledgeBaseFile
    } catch (error: any) {
      knowledgeBaseFile.status = KnowledgeBaseFileStatus.FAILED
      knowledgeBaseFile.errorMessage =
        error?.message || "Failed to process uploaded file"
      await updateKnowledgeBaseFile(knowledgeBaseFile)
      throw error
    }
  } catch (error: any) {
    if (persistInObjectStore) {
      await objectStore
        .deleteFile(ObjectStoreBuckets.APPS, objectStoreKey)
        .catch(() => {
          // Ignore, it might not exist
        })
    }
    throw error
  }
}
