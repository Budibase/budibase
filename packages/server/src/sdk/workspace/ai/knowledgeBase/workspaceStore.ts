import {
  context,
  db as dbCore,
  locks,
  objectStore,
} from "@budibase/backend-core"
import {
  DocumentType,
  Document,
  GeminiKnowledgeBase,
  KnowledgeBase,
  KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
  LockName,
  LockType,
} from "@budibase/types"
import { ObjectStoreBuckets } from "../../../../constants"
import { syncKeyVectorStores } from "../configs/litellm"
import { prepareTabularKnowledgeFileForRagIngestion } from "../rag/processors/tabularText"
import { listKnowledgeBaseFiles } from "./files"
import {
  createGeminiFileStore,
  deleteGeminiVectorStore,
  ingestGeminiFile,
} from "./geminiFileStore"

interface IndexedFile {
  fileId: string
  objectStoreKey: string
  sourceId: string
}

export interface WorkspaceGeminiStore extends Document {
  storeId: string
  files: IndexedFile[]
}

interface WorkspaceGeminiPublish extends Document {
  previousStores: WorkspaceGeminiStore[]
  blockedKnowledgeBaseIds: string[]
}

const publishRecordId = `${DocumentType.GEMINI_KNOWLEDGE_PUBLISH}_active`

const storeRecordId = (knowledgeBaseId: string) =>
  `${DocumentType.GEMINI_KNOWLEDGE_STORE}_${knowledgeBaseId}`

const readyFilesForStore = (files: KnowledgeBaseFile[]) =>
  files
    .filter(
      file =>
        file._id &&
        file.objectStoreKey &&
        file.status === KnowledgeBaseFileStatus.READY
    )
    .sort((a, b) => a._id!.localeCompare(b._id!))

const matchesReadyFiles = (
  store: WorkspaceGeminiStore,
  files: KnowledgeBaseFile[]
) =>
  store.files.length === files.length &&
  files.every(
    (file, index) =>
      store.files[index].fileId === file._id &&
      store.files[index].objectStoreKey === file.objectStoreKey
  )

const loadFile = async (objectStoreKey: string): Promise<Buffer> => {
  const { stream } = await objectStore.getReadStream(
    ObjectStoreBuckets.APPS,
    objectStoreKey
  )
  const chunks: Uint8Array[] = []
  for await (const chunk of stream) {
    chunks.push(new Uint8Array(chunk))
  }
  return Buffer.concat(chunks)
}

export const listWorkspaceGeminiStores = async () => {
  const result = await context.getWorkspaceDB().allDocs<WorkspaceGeminiStore>({
    startkey: `${DocumentType.GEMINI_KNOWLEDGE_STORE}_`,
    endkey: `${DocumentType.GEMINI_KNOWLEDGE_STORE}_\ufff0`,
    include_docs: true,
  })
  return result.rows.flatMap(row =>
    row.doc && !row.doc._deleted ? [row.doc] : []
  )
}

export const beginWorkspaceGeminiPublish = async (): Promise<void> => {
  const db = context.getWorkspaceDB()
  if (await db.tryGet<WorkspaceGeminiPublish>(publishRecordId)) {
    return
  }
  await db.put({
    _id: publishRecordId,
    previousStores: await listWorkspaceGeminiStores(),
    blockedKnowledgeBaseIds: [],
  } satisfies WorkspaceGeminiPublish)
}

export const completeWorkspaceGeminiPublish = async (): Promise<void> => {
  const db = context.getWorkspaceDB()
  const pending = await db.tryGet<WorkspaceGeminiPublish>(publishRecordId)
  if (!pending) {
    return
  }
  await db.remove(pending)
  const activeIds = new Set(
    (await listWorkspaceGeminiStores()).map(store => store.storeId)
  )
  for (const previous of pending.previousStores) {
    if (!activeIds.has(previous.storeId)) {
      await deleteGeminiVectorStore(previous.storeId, {
        allowNotFound: false,
      }).catch(error => {
        console.error("Failed to delete previous production Gemini store", {
          storeId: previous.storeId,
          error,
        })
      })
    }
  }
}

export const invalidateWorkspaceGeminiPublishStore = async (
  knowledgeBaseId: string
): Promise<void> => {
  const db = context.getWorkspaceDB()
  const pending = await db.tryGet<WorkspaceGeminiPublish>(publishRecordId)
  if (!pending) {
    return
  }
  pending.blockedKnowledgeBaseIds = Array.from(
    new Set([...(pending.blockedKnowledgeBaseIds || []), knowledgeBaseId])
  )
  await db.put(pending)
}

export const invalidateActiveWorkspaceGeminiStore = async (
  knowledgeBaseId: string
): Promise<void> => {
  await invalidateWorkspaceGeminiPublishStore(knowledgeBaseId)
  const db = context.getWorkspaceDB()
  const existing = await db.tryGet<WorkspaceGeminiStore>(
    storeRecordId(knowledgeBaseId)
  )
  if (!existing) {
    return
  }
  await db.remove(existing)
  await syncKeyVectorStores()
  await deleteGeminiVectorStore(existing.storeId, {
    allowNotFound: false,
  }).catch(error => {
    console.error("Failed to delete reset workspace Gemini store", {
      storeId: existing.storeId,
      error,
    })
  })
}

export const ensureWorkspaceGeminiStore = async (
  knowledgeBase: GeminiKnowledgeBase,
  options: { force?: boolean } = {}
): Promise<WorkspaceGeminiStore | undefined> => {
  const knowledgeBaseId = knowledgeBase._id
  if (!knowledgeBaseId) {
    throw new Error("Knowledge base id not set")
  }
  const workspaceId = context.getOrThrowWorkspaceId()
  const { result } = await locks.doWithLock(
    {
      name: LockName.GEMINI_KNOWLEDGE_STORE_BUILD,
      type: LockType.AUTO_EXTEND,
      resource: dbCore.getProdWorkspaceID(workspaceId),
    },
    async () => {
      const db = context.getWorkspaceDB()
      const pending = await db.tryGet<WorkspaceGeminiPublish>(publishRecordId)
      if (pending && !options.force) {
        if (pending.blockedKnowledgeBaseIds?.includes(knowledgeBaseId)) {
          return undefined
        }
        return pending.previousStores.find(
          store => store._id === storeRecordId(knowledgeBaseId)
        )
      }
      const files = readyFilesForStore(
        await listKnowledgeBaseFiles(knowledgeBaseId)
      )
      const id = storeRecordId(knowledgeBaseId)
      const existing = await db.tryGet<WorkspaceGeminiStore>(id)
      if (!files.length) {
        if (existing) {
          await db.remove(existing)
          await syncKeyVectorStores()
          if (!pending) {
            await deleteGeminiVectorStore(existing.storeId, {
              allowNotFound: false,
            }).catch(error => {
              console.error("Failed to delete empty workspace Gemini store", {
                storeId: existing.storeId,
                error,
              })
            })
          }
        }
        return undefined
      }
      if (existing && matchesReadyFiles(existing, files)) {
        return existing
      }

      const storeId = await createGeminiFileStore(
        `${knowledgeBase.name} (${workspaceId})`
      )
      try {
        await syncKeyVectorStores([storeId])
        const indexedFiles: IndexedFile[] = []
        for (const file of files) {
          const prepared = prepareTabularKnowledgeFileForRagIngestion({
            filename: file.filename,
            mimetype: file.mimetype,
            buffer: await loadFile(file.objectStoreKey),
          })
          const ingested = await ingestGeminiFile({
            vectorStoreId: storeId,
            filename: prepared.filename,
            mimetype: prepared.mimetype,
            buffer: prepared.buffer,
          })
          indexedFiles.push({
            fileId: file._id!,
            objectStoreKey: file.objectStoreKey,
            sourceId: ingested.fileId,
          })
        }

        const currentFiles = readyFilesForStore(
          await listKnowledgeBaseFiles(knowledgeBaseId)
        )
        const candidate: WorkspaceGeminiStore = {
          _id: id,
          _rev: existing?._rev,
          storeId,
          files: indexedFiles,
        }
        if (!matchesReadyFiles(candidate, currentFiles)) {
          throw new Error(
            "Knowledge files changed while rebuilding Gemini store"
          )
        }
        const { rev } = await db.put(candidate)
        candidate._rev = rev
        await syncKeyVectorStores().catch(error => {
          console.error(
            "Failed to refresh workspace Gemini store permissions",
            {
              storeId,
              error,
            }
          )
        })
        if (existing && !pending) {
          await deleteGeminiVectorStore(existing.storeId, {
            allowNotFound: false,
          }).catch(error => {
            console.error("Failed to delete previous workspace Gemini store", {
              storeId: existing.storeId,
              error,
            })
          })
        }
        return candidate
      } catch (error) {
        await syncKeyVectorStores().catch(permissionError => {
          console.error("Failed to remove incomplete Gemini store permission", {
            storeId,
            permissionError,
          })
        })
        await deleteGeminiVectorStore(storeId, {
          allowNotFound: false,
        }).catch(cleanupError => {
          console.error("Failed to delete incomplete workspace Gemini store", {
            storeId,
            cleanupError,
          })
        })
        throw error
      }
    }
  )
  return result
}

export const reconcileWorkspaceGeminiStores = async (
  knowledgeBases: KnowledgeBase[]
): Promise<void> => {
  const existingStores = await listWorkspaceGeminiStores()
  if (!existingStores.length && !knowledgeBases.length) {
    return
  }
  const activeIds = new Set(
    knowledgeBases.map(knowledgeBase => knowledgeBase._id)
  )
  let removedStore = false
  for (const store of existingStores) {
    if (!store._id) {
      continue
    }
    const knowledgeBaseId = store._id.slice(
      `${DocumentType.GEMINI_KNOWLEDGE_STORE}_`.length
    )
    if (activeIds.has(knowledgeBaseId)) {
      continue
    }
    await context.getWorkspaceDB().remove(store)
    removedStore = true
    await deleteGeminiVectorStore(store.storeId, {
      allowNotFound: false,
    }).catch(error => {
      console.error("Failed to delete removed knowledge base Gemini store", {
        storeId: store.storeId,
        error,
      })
    })
  }
  for (const knowledgeBase of knowledgeBases) {
    await ensureWorkspaceGeminiStore(knowledgeBase, { force: true })
  }
  if (removedStore) {
    await syncKeyVectorStores()
  }
}
