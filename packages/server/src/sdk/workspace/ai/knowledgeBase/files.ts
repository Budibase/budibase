import {
  context,
  db,
  docIds,
  HTTPError,
  objectStore,
} from "@budibase/backend-core"
import {
  DocumentType,
  KnowledgeBase,
  KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
  RequiredKeys,
  ToDocCreateMetadata,
} from "@budibase/types"
import { ObjectStoreBuckets } from "../../../../constants"
import { deleteKnowledgeBaseFileChunks } from "../rag/files"

type CreateKnowledgeBaseFileOptions = Pick<
  KnowledgeBaseFile,
  | "knowledgeSourceId"
  | "filename"
  | "sourcePath"
  | "mimetype"
  | "size"
  | "uploadedBy"
  | "objectStoreKey"
  | "originFileId"
> & {
  id: string
  retrievalFileId?: KnowledgeBaseFile["retrievalFileId"]
}

export const createKnowledgeBaseFile = async (
  options: CreateKnowledgeBaseFileOptions
): Promise<KnowledgeBaseFile> => {
  const db = context.getWorkspaceDB()
  const {
    id,
    knowledgeSourceId,
    filename,
    sourcePath,
    mimetype,
    size,
    uploadedBy,
    objectStoreKey,
    retrievalFileId,
    originFileId,
  } = options
  const _id = id
  if (!docIds.isKnowledgeBaseFileID(_id)) {
    throw new Error(`Id ${_id} is not valid for a knowledge base file`)
  }

  const doc: RequiredKeys<ToDocCreateMetadata<KnowledgeBaseFile>> = {
    _id,
    knowledgeSourceId,
    filename,
    sourcePath,
    mimetype,
    size,
    objectStoreKey,
    retrievalFileId: retrievalFileId || _id,
    originFileId,
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
  knowledgeBase: KnowledgeBase,
  file: KnowledgeBaseFile
) => {
  let isFileInProduction = false

  try {
    const prodWorkspaceId = db.getProdWorkspaceID(
      context.getOrThrowWorkspaceId()
    )
    await context.doInWorkspaceContext(prodWorkspaceId, async () => {
      await getKnowledgeBaseFileOrThrow(file._id!)
      isFileInProduction = true
    })
  } catch (error: any) {
    if (error?.status !== 404) {
      throw error
    }
  }

  if (!isFileInProduction) {
    await deleteKnowledgeBaseFileChunks(knowledgeBase, [file.retrievalFileId])
  }

  if (file.objectStoreKey) {
    try {
      await objectStore.deleteFile(ObjectStoreBuckets.APPS, file.objectStoreKey)
    } catch (error) {
      console.log(
        "Failed to delete knowledge base file from object store",
        error
      )
    }
  }

  await context.getWorkspaceDB().remove(file)
}
