const mockCurrentDbTryGet = jest.fn()
const mockCurrentDbRemove = jest.fn()
const mockProductionDbTryGet = jest.fn()
const mockDeleteObject = jest.fn()
const mockDeleteChunks = jest.fn()
const mockRemoveRagJob = jest.fn()
let productionContext = false

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getOrThrowWorkspaceId: () => "app_dev_test",
      getWorkspaceDB: () =>
        productionContext
          ? { tryGet: mockProductionDbTryGet }
          : {
              tryGet: mockCurrentDbTryGet,
              remove: mockCurrentDbRemove,
            },
      doInWorkspaceContext: async (_workspaceId: string, fn: () => void) => {
        productionContext = true
        try {
          return await fn()
        } finally {
          productionContext = false
        }
      },
    },
    objectStore: {
      ...actual.objectStore,
      deleteFile: (...args: Parameters<typeof mockDeleteObject>) =>
        mockDeleteObject(...args),
    },
  }
})

jest.mock("../rag/files", () => ({
  deleteKnowledgeBaseFileChunks: (
    ...args: Parameters<typeof mockDeleteChunks>
  ) => mockDeleteChunks(...args),
}))

jest.mock("../rag/ragQueue", () => ({
  removeRagFileIngestionJob: (...args: Parameters<typeof mockRemoveRagJob>) =>
    mockRemoveRagJob(...args),
}))

import { KnowledgeBaseFileStatus, KnowledgeBaseType } from "@budibase/types"
import { removeKnowledgeBaseFile } from "./files"

describe("knowledge base file deletion", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    productionContext = false
    mockProductionDbTryGet.mockResolvedValue(undefined)
    mockCurrentDbRemove.mockResolvedValue(undefined)
    mockDeleteObject.mockResolvedValue(undefined)
    mockDeleteChunks.mockResolvedValue(undefined)
    mockRemoveRagJob.mockResolvedValue(undefined)
  })

  it("waits for ingestion and deletes the latest stored file revision", async () => {
    const staleFile = {
      _id: "kb_file_1",
      _rev: "1-old",
      knowledgeBaseId: "kb_1",
      filename: "notes.txt",
      objectStoreKey: "objects/old-notes.txt",
      status: KnowledgeBaseFileStatus.PROCESSING,
      uploadedBy: "sharepoint:source_1",
    }
    const latestFile = {
      ...staleFile,
      _rev: "2-latest",
      objectStoreKey: "objects/latest-notes.txt",
      ragSourceId: "gemini_file_1",
      status: KnowledgeBaseFileStatus.READY,
    }
    const knowledgeBase = {
      _id: "kb_1",
      name: "Support docs",
      type: KnowledgeBaseType.GEMINI,
      config: { googleFileStoreId: "store_1" },
    }
    mockCurrentDbTryGet.mockResolvedValue(latestFile)

    await removeKnowledgeBaseFile(knowledgeBase, staleFile)

    expect(mockRemoveRagJob).toHaveBeenCalledWith("kb_file_1", true)
    expect(mockDeleteChunks).toHaveBeenCalledWith(knowledgeBase, [
      "gemini_file_1",
    ])
    expect(mockDeleteObject).toHaveBeenCalledWith(
      expect.any(String),
      "objects/latest-notes.txt"
    )
    expect(mockCurrentDbRemove).toHaveBeenCalledWith(latestFile)
  })
})
