import {
  context,
  db,
  docIds,
  events,
  HTTPError,
  locks,
  objectStore,
} from "@budibase/backend-core"
import {
  DocumentType,
  KnowledgeBase,
  KnowledgeBaseFile,
  KnowledgeBaseFileSource,
  KnowledgeBaseFileStatus,
  LockName,
  LockType,
  RequiredKeys,
  ToDocCreateMetadata,
  WithRequired,
} from "@budibase/types"
import { ObjectStoreBuckets } from "../../../../constants"
import { invalidateWorkspaceGeminiPublishStore } from "./workspaceStore"

interface CreateKnowledgeBaseFileOptions {
  id: string
  knowledgeBaseId: string
  source?: KnowledgeBaseFileSource
  filename: string
  mimetype?: string
  size?: number
  uploadedBy: string
  objectStoreKey: string
  ragSourceId?: string
}

export const createKnowledgeBaseFile = async (
  options: CreateKnowledgeBaseFileOptions
): Promise<WithRequired<KnowledgeBaseFile, "_id">> => {
  const db = context.getWorkspaceDB()
  const {
    id,
    knowledgeBaseId,
    source,
    filename,
    mimetype,
    size,
    uploadedBy,
    objectStoreKey,
    ragSourceId,
  } = options
  const _id = id || docIds.generateKnowledgeBaseFileID(knowledgeBaseId)
  if (!docIds.isKnowledgeBaseFileID(_id)) {
    throw new Error(`Id ${_id} is not valid for a knowledge base file`)
  }

  const doc: RequiredKeys<ToDocCreateMetadata<KnowledgeBaseFile>> = {
    _id,
    knowledgeBaseId,
    source,
    filename,
    mimetype,
    size,
    objectStoreKey,
    ragSourceId: ragSourceId || _id,
    status: KnowledgeBaseFileStatus.PROCESSING,
    uploadedBy,
    errorMessage: undefined,
    processedAt: undefined,
  }

  const { rev } = await db.put(doc)
  return {
    ...doc,
    _rev: rev,
  }
}

export const updateKnowledgeBaseFile = async (
  file: KnowledgeBaseFile
): Promise<KnowledgeBaseFile> => {
  const db = context.getWorkspaceDB()
  const updated = { ...file }
  const { rev } = await db.put(file)
  updated._rev = rev
  return updated
}

export const getKnowledgeBaseFileOrThrow = async (fileId: string) => {
  const db = context.getWorkspaceDB()
  const file = await db.tryGet<KnowledgeBaseFile>(fileId)
  if (!file || file._deleted) {
    throw new HTTPError("Knowledge base file not found", 404)
  }
  return file
}

export const listKnowledgeBaseFiles = async (
  knowledgeBaseId: string
): Promise<KnowledgeBaseFile[]> => {
  const db = context.getWorkspaceDB()
  const response = await db.allDocs<KnowledgeBaseFile>(
    docIds.getDocParams(DocumentType.KNOWLEDGE_BASE_FILE, knowledgeBaseId, {
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

export const removeKnowledgeBaseFile = async (
  _knowledgeBase: KnowledgeBase,
  file: KnowledgeBaseFile
) => {
  const workspaceId = context.getOrThrowWorkspaceId()
  await locks.doWithLock(
    {
      name: LockName.GEMINI_KNOWLEDGE_STORE_BUILD,
      type: LockType.AUTO_EXTEND,
      resource: db.getProdWorkspaceID(workspaceId),
    },
    async () => {
      await invalidateWorkspaceGeminiPublishStore(file.knowledgeBaseId)
      let isFileReferencedInOtherWorkspace = false

      try {
        const otherWorkspaceId = db.isProdWorkspaceID(workspaceId)
          ? db.getDevWorkspaceID(workspaceId)
          : db.getProdWorkspaceID(workspaceId)
        await context.doInWorkspaceContext(otherWorkspaceId, async () => {
          const otherFile = await getKnowledgeBaseFileOrThrow(file._id!)
          isFileReferencedInOtherWorkspace =
            otherFile.objectStoreKey === file.objectStoreKey
        })
      } catch (error: any) {
        if (error?.status !== 404) {
          throw error
        }
      }

      await context.getWorkspaceDB().remove(file)

      if (file.objectStoreKey && !isFileReferencedInOtherWorkspace) {
        try {
          await objectStore.deleteFile(
            ObjectStoreBuckets.APPS,
            file.objectStoreKey
          )
        } catch (error) {
          console.log(
            "Failed to delete knowledge base file from object store",
            error
          )
        }
      }

      events.ai.ragFileDeleted({
        knowledgeBaseId: file.knowledgeBaseId,
        fileId: file._id!,
        sourceType: file.source?.type,
      })
    }
  )
}
