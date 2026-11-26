import { Readable } from "stream"
import { KnowledgeBaseFileStatus, KnowledgeBaseType } from "@budibase/types"

const mockGetWorkspaceId = jest.fn()
const mockGetWorkspaceDB = jest.fn()
const mockListFiles = jest.fn()
const mockCreateStore = jest.fn()
const mockIngestFile = jest.fn()
const mockDeleteStore = jest.fn()
const mockSyncKeyVectorStores = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getOrThrowWorkspaceId: (...args: any[]) => mockGetWorkspaceId(...args),
      getWorkspaceDB: (...args: any[]) => mockGetWorkspaceDB(...args),
    },
    locks: {
      ...actual.locks,
      doWithLock: async (
        _options: unknown,
        action: () => Promise<unknown>
      ) => ({
        result: await action(),
      }),
    },
    objectStore: {
      ...actual.objectStore,
      getReadStream: async () => ({ stream: Readable.from(["file content"]) }),
    },
  }
})

jest.mock("./files", () => ({
  listKnowledgeBaseFiles: (...args: any[]) => mockListFiles(...args),
}))

jest.mock("./geminiFileStore", () => ({
  createGeminiFileStore: (...args: any[]) => mockCreateStore(...args),
  ingestGeminiFile: (...args: any[]) => mockIngestFile(...args),
  deleteGeminiVectorStore: (...args: any[]) => mockDeleteStore(...args),
}))

jest.mock("../configs/litellm", () => ({
  syncKeyVectorStores: (...args: any[]) => mockSyncKeyVectorStores(...args),
}))

import {
  beginWorkspaceGeminiPublish,
  completeWorkspaceGeminiPublish,
  ensureWorkspaceGeminiStore,
  invalidateWorkspaceGeminiPublishStore,
  reconcileWorkspaceGeminiStores,
} from "./workspaceStore"

describe("workspace Gemini store", () => {
  const documents = new Map<string, Map<string, any>>()
  const knowledgeBase = {
    _id: "kb_1",
    name: "Knowledge",
    type: KnowledgeBaseType.GEMINI,
    config: { googleFileStoreId: "legacy-shared-store" },
  }
  const readyFile = {
    _id: "file_1",
    knowledgeBaseId: "kb_1",
    filename: "ready.md",
    objectStoreKey: "objects/ready.md",
    status: KnowledgeBaseFileStatus.READY,
  }

  beforeEach(() => {
    jest.resetAllMocks()
    documents.clear()
    mockCreateStore
      .mockResolvedValueOnce("dev-store")
      .mockResolvedValueOnce("prod-store")
      .mockResolvedValueOnce("replacement-store")
    mockIngestFile.mockResolvedValue({ fileId: "indexed-source" })
    mockDeleteStore.mockResolvedValue(undefined)
    mockSyncKeyVectorStores.mockResolvedValue(undefined)
    mockGetWorkspaceDB.mockImplementation(() => {
      const workspaceId = mockGetWorkspaceId()
      let docs = documents.get(workspaceId)
      if (!docs) {
        docs = new Map()
        documents.set(workspaceId, docs)
      }
      return {
        tryGet: async (id: string) => docs!.get(id),
        allDocs: async ({
          startkey,
          endkey,
        }: {
          startkey: string
          endkey: string
        }) => ({
          rows: Array.from(docs!.values())
            .filter(doc => doc._id >= startkey && doc._id <= endkey)
            .map(doc => ({ doc })),
        }),
        put: async (doc: any) => {
          docs!.set(doc._id, doc)
          return { rev: "2-test" }
        },
        remove: async (doc: any) => {
          docs!.delete(doc._id)
        },
      }
    })
  })

  it("builds separate dev and prod stores from READY files only", async () => {
    mockListFiles.mockImplementation(async () =>
      mockGetWorkspaceId() === "app_dev_1"
        ? [
            readyFile,
            {
              ...readyFile,
              _id: "dev_only",
              objectStoreKey: "objects/dev-only.md",
              status: KnowledgeBaseFileStatus.READY,
            },
            {
              ...readyFile,
              _id: "processing_file",
              status: KnowledgeBaseFileStatus.PROCESSING,
            },
          ]
        : [
            { ...readyFile, _id: "prod_file" },
            {
              ...readyFile,
              _id: "failed_file",
              status: KnowledgeBaseFileStatus.FAILED,
            },
          ]
    )

    mockGetWorkspaceId.mockReturnValue("app_dev_1")
    const devStore = await ensureWorkspaceGeminiStore(knowledgeBase)
    mockGetWorkspaceId.mockReturnValue("app_1")
    const prodStore = await ensureWorkspaceGeminiStore(knowledgeBase)

    expect(devStore?.storeId).toBe("dev-store")
    expect(prodStore?.storeId).toBe("prod-store")
    expect(devStore?.files).toEqual([
      {
        fileId: "dev_only",
        objectStoreKey: "objects/dev-only.md",
        sourceId: "indexed-source",
      },
      {
        fileId: "file_1",
        objectStoreKey: "objects/ready.md",
        sourceId: "indexed-source",
      },
    ])
    expect(prodStore?.files.map(file => file.fileId)).toEqual(["prod_file"])
    expect(mockIngestFile).toHaveBeenCalledTimes(3)
    expect(mockIngestFile).not.toHaveBeenCalledWith(
      expect.objectContaining({ vectorStoreId: "legacy-shared-store" })
    )
  })

  it("replaces the active store when a READY file is removed", async () => {
    mockGetWorkspaceId.mockReturnValue("app_dev_1")
    const initialFiles = [
      readyFile,
      { ...readyFile, _id: "file_2", objectStoreKey: "objects/second.md" },
    ]
    mockListFiles
      .mockResolvedValueOnce(initialFiles)
      .mockResolvedValueOnce(initialFiles)
    const initial = await ensureWorkspaceGeminiStore(knowledgeBase)
    mockListFiles.mockResolvedValue([readyFile])

    const rebuilt = await ensureWorkspaceGeminiStore(knowledgeBase)

    expect(initial?.storeId).toBe("dev-store")
    expect(rebuilt?.storeId).toBe("prod-store")
    expect(rebuilt?.files.map(file => file.fileId)).toEqual(["file_1"])
    expect(mockDeleteStore).toHaveBeenCalledWith("dev-store", {
      allowNotFound: false,
    })
  })

  it("deactivates the store when no READY files remain", async () => {
    mockGetWorkspaceId.mockReturnValue("app_dev_1")
    mockListFiles.mockResolvedValue([readyFile])
    await ensureWorkspaceGeminiStore(knowledgeBase)
    mockListFiles.mockResolvedValue([])

    await expect(
      ensureWorkspaceGeminiStore(knowledgeBase)
    ).resolves.toBeUndefined()

    expect(
      await mockGetWorkspaceDB().tryGet("geminiknowledgestore_kb_1")
    ).toBeUndefined()
    expect(mockDeleteStore).toHaveBeenCalledWith("dev-store", {
      allowNotFound: false,
    })
  })

  it("keeps the previous production snapshot until publish completes", async () => {
    mockGetWorkspaceId.mockReturnValue("app_1")
    mockListFiles.mockResolvedValue([readyFile])
    const initial = await ensureWorkspaceGeminiStore(knowledgeBase)
    await beginWorkspaceGeminiPublish()
    mockListFiles.mockResolvedValue([
      readyFile,
      { ...readyFile, _id: "file_2", objectStoreKey: "objects/second.md" },
    ])

    const duringPublish = await ensureWorkspaceGeminiStore(knowledgeBase)
    await reconcileWorkspaceGeminiStores([knowledgeBase])
    const beforeCompletion = await ensureWorkspaceGeminiStore(knowledgeBase)
    await completeWorkspaceGeminiPublish()
    const afterCompletion = await ensureWorkspaceGeminiStore(knowledgeBase)

    expect(duringPublish?.storeId).toBe(initial?.storeId)
    expect(beforeCompletion?.storeId).toBe(initial?.storeId)
    expect(afterCompletion?.storeId).toBe("prod-store")
  })

  it("blocks the previous snapshot when its file is explicitly deleted", async () => {
    mockGetWorkspaceId.mockReturnValue("app_1")
    mockListFiles.mockResolvedValue([readyFile])
    await ensureWorkspaceGeminiStore(knowledgeBase)
    await beginWorkspaceGeminiPublish()

    await invalidateWorkspaceGeminiPublishStore("kb_1")

    await expect(
      ensureWorkspaceGeminiStore(knowledgeBase)
    ).resolves.toBeUndefined()
  })

  it("does not activate an incomplete replacement store", async () => {
    mockGetWorkspaceId.mockReturnValue("app_dev_1")
    mockListFiles.mockResolvedValue([readyFile])
    const initial = await ensureWorkspaceGeminiStore(knowledgeBase)
    mockListFiles.mockResolvedValue([
      readyFile,
      { ...readyFile, _id: "file_2", objectStoreKey: "objects/second.md" },
    ])
    mockIngestFile.mockRejectedValueOnce(new Error("ingestion failed"))

    await expect(ensureWorkspaceGeminiStore(knowledgeBase)).rejects.toThrow(
      "ingestion failed"
    )

    const stored = await mockGetWorkspaceDB().tryGet(
      "geminiknowledgestore_kb_1"
    )
    expect(stored.storeId).toBe(initial?.storeId)
  })

  it("keeps dev and prod file sets independent through add, publish, and deletion", async () => {
    let nextStore = 0
    mockCreateStore.mockReset().mockImplementation(async () => {
      nextStore++
      return `workspace-store-${nextStore}`
    })
    const addedFile = {
      ...readyFile,
      _id: "dev_added",
      objectStoreKey: "objects/dev-added.md",
    }
    const filesByWorkspace = new Map([
      ["app_dev_1", [readyFile]],
      ["app_1", [readyFile]],
    ])
    mockListFiles.mockImplementation(async () =>
      filesByWorkspace.get(mockGetWorkspaceId())
    )
    const queryFiles = async (workspaceId: string) => {
      mockGetWorkspaceId.mockReturnValue(workspaceId)
      const store = await ensureWorkspaceGeminiStore(knowledgeBase)
      return {
        storeId: store?.storeId,
        fileIds: store?.files.map(file => file.fileId) || [],
      }
    }

    const initialDev = await queryFiles("app_dev_1")
    const initialProd = await queryFiles("app_1")
    expect(initialDev.fileIds).toEqual(["file_1"])
    expect(initialProd.fileIds).toEqual(["file_1"])
    expect(initialDev.storeId).not.toBe(initialProd.storeId)

    filesByWorkspace.set("app_dev_1", [readyFile, addedFile])
    expect((await queryFiles("app_dev_1")).fileIds).toEqual([
      "dev_added",
      "file_1",
    ])
    expect((await queryFiles("app_1")).fileIds).toEqual(["file_1"])

    mockGetWorkspaceId.mockReturnValue("app_1")
    await beginWorkspaceGeminiPublish()
    filesByWorkspace.set("app_1", [readyFile, addedFile])
    expect((await queryFiles("app_1")).fileIds).toEqual(["file_1"])
    await reconcileWorkspaceGeminiStores([knowledgeBase])
    expect((await queryFiles("app_1")).fileIds).toEqual(["file_1"])
    await completeWorkspaceGeminiPublish()
    expect((await queryFiles("app_1")).fileIds).toEqual(["dev_added", "file_1"])

    filesByWorkspace.set("app_dev_1", [readyFile])
    expect((await queryFiles("app_dev_1")).fileIds).toEqual(["file_1"])
    expect((await queryFiles("app_1")).fileIds).toEqual(["dev_added", "file_1"])

    mockGetWorkspaceId.mockReturnValue("app_1")
    await beginWorkspaceGeminiPublish()
    filesByWorkspace.set("app_1", [readyFile])
    await reconcileWorkspaceGeminiStores([knowledgeBase])
    await completeWorkspaceGeminiPublish()
    expect((await queryFiles("app_1")).fileIds).toEqual(["file_1"])
  })
})
