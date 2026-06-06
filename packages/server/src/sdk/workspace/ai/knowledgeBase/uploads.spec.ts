const mockGetWorkspaceId = jest.fn()
const mockGetWorkspaceDB = jest.fn()
const mockFindKnowledgeBase = jest.fn()
const mockGetKnowledgeBaseFileOrThrow = jest.fn()
const mockListKnowledgeBaseFiles = jest.fn()
const mockUpdateKnowledgeBaseFile = jest.fn()
const mockEnqueueRagFileIngestion = jest.fn()
const mockRemoveRagFileIngestionJob = jest.fn()
const mockCreateGeminiFileStore = jest.fn()
const mockDeleteGeminiVectorStore = jest.fn()
const mockSyncKeyVectorStores = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      getOrThrowWorkspaceId: (...args: any[]) => mockGetWorkspaceId(...args),
      getWorkspaceDB: (...args: any[]) => mockGetWorkspaceDB(...args),
    },
  }
})

jest.mock("./crud", () => ({
  find: (...args: any[]) => mockFindKnowledgeBase(...args),
}))

jest.mock("./files", () => ({
  createKnowledgeBaseFile: jest.fn(),
  updateKnowledgeBaseFile: (...args: any[]) =>
    mockUpdateKnowledgeBaseFile(...args),
  getKnowledgeBaseFileOrThrow: (...args: any[]) =>
    mockGetKnowledgeBaseFileOrThrow(...args),
  listKnowledgeBaseFiles: (...args: any[]) =>
    mockListKnowledgeBaseFiles(...args),
}))

jest.mock("../rag/ragQueue", () => ({
  enqueueRagFileIngestion: (...args: any[]) =>
    mockEnqueueRagFileIngestion(...args),
  removeRagFileIngestionJob: (...args: any[]) =>
    mockRemoveRagFileIngestionJob(...args),
}))

jest.mock("./geminiFileStore", () => ({
  createGeminiFileStore: (...args: any[]) => mockCreateGeminiFileStore(...args),
  deleteGeminiVectorStore: (...args: any[]) =>
    mockDeleteGeminiVectorStore(...args),
}))

jest.mock("../configs/litellm", () => ({
  syncKeyVectorStores: (...args: any[]) => mockSyncKeyVectorStores(...args),
}))

import { KnowledgeBaseFileStatus, KnowledgeBaseType } from "@budibase/types"
import {
  resetKnowledgeBaseStore,
  retryKnowledgeBaseFileIngestion,
  uploadKnowledgeBaseFile,
} from "./uploads"

describe("knowledgeBase uploads", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetWorkspaceId.mockReturnValue("workspace_1")
    mockUpdateKnowledgeBaseFile.mockResolvedValue(undefined)
    mockEnqueueRagFileIngestion.mockResolvedValue(undefined)
  })

  it("throws 404 when knowledge base does not exist", async () => {
    mockFindKnowledgeBase.mockResolvedValue(undefined)

    await expect(
      uploadKnowledgeBaseFile({
        knowledgeBaseId: "kb_missing",
        filename: "notes.txt",
        buffer: Buffer.from("test"),
        uploadedBy: "user_1",
      })
    ).rejects.toMatchObject({
      status: 404,
      message: "Knowledge base not found",
    })
  })

  it("requeues a failed file and resets its processing state", async () => {
    mockGetKnowledgeBaseFileOrThrow.mockResolvedValue({
      _id: "kb_file_1",
      knowledgeBaseId: "kb_1",
      objectStoreKey: "workspace_1/path/file.txt",
      status: KnowledgeBaseFileStatus.FAILED,
      errorMessage: "processing failed",
      processedAt: "2025-01-01T00:00:00.000Z",
    })

    await retryKnowledgeBaseFileIngestion("kb_file_1")

    expect(mockUpdateKnowledgeBaseFile).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "kb_file_1",
        status: KnowledgeBaseFileStatus.PROCESSING,
        errorMessage: undefined,
        processedAt: undefined,
      })
    )
    expect(mockEnqueueRagFileIngestion).toHaveBeenCalledWith({
      workspaceId: "workspace_1",
      knowledgeBaseId: "kb_1",
      fileId: "kb_file_1",
      objectStoreKey: "workspace_1/path/file.txt",
    })
  })

  it("throws when trying to requeue a non-failed file", async () => {
    mockGetKnowledgeBaseFileOrThrow.mockResolvedValue({
      _id: "kb_file_1",
      knowledgeBaseId: "kb_1",
      objectStoreKey: "workspace_1/path/file.txt",
      status: KnowledgeBaseFileStatus.READY,
    })

    await expect(
      retryKnowledgeBaseFileIngestion("kb_file_1")
    ).rejects.toMatchObject({
      status: 400,
      message: "Knowledge base file is not in failed state",
    })
    expect(mockEnqueueRagFileIngestion).not.toHaveBeenCalled()
  })
})

describe("resetKnowledgeBaseStore", () => {
  const knowledgeBase = {
    _id: "kb_1",
    name: "Support Docs",
    type: KnowledgeBaseType.GEMINI,
    config: { googleFileStoreId: "old-store-id" },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetWorkspaceId.mockReturnValue("workspace_1")
    mockGetWorkspaceDB.mockReturnValue({
      put: jest.fn().mockResolvedValue({ rev: "2-abc" }),
    })
    mockCreateGeminiFileStore.mockResolvedValue("new-store-id")
    mockDeleteGeminiVectorStore.mockResolvedValue(undefined)
    mockSyncKeyVectorStores.mockResolvedValue(undefined)
    mockUpdateKnowledgeBaseFile.mockResolvedValue(undefined)
    mockEnqueueRagFileIngestion.mockResolvedValue(undefined)
    mockRemoveRagFileIngestionJob.mockResolvedValue(undefined)
  })

  it("creates a new store, re-enqueues all files with objectStoreKey, and skips files without one", async () => {
    const db = { put: jest.fn().mockResolvedValue({ rev: "2-abc" }) }
    mockGetWorkspaceDB.mockReturnValue(db)
    mockListKnowledgeBaseFiles.mockResolvedValue([
      {
        _id: "file_1",
        knowledgeBaseId: "kb_1",
        objectStoreKey: "workspace_1/path/file1.txt",
        status: KnowledgeBaseFileStatus.FAILED,
        ragSourceId: "rag_src_1",
        errorMessage: "some error",
        processedAt: "2025-01-01T00:00:00.000Z",
      },
      {
        _id: "file_2",
        knowledgeBaseId: "kb_1",
        objectStoreKey: undefined,
        status: KnowledgeBaseFileStatus.FAILED,
      },
      {
        _id: "file_3",
        knowledgeBaseId: "kb_1",
        objectStoreKey: "workspace_1/path/file3.txt",
        status: KnowledgeBaseFileStatus.READY,
        ragSourceId: "rag_src_3",
      },
    ])

    await resetKnowledgeBaseStore(knowledgeBase as any)

    expect(mockCreateGeminiFileStore).toHaveBeenCalledWith("Support Docs")
    expect(mockDeleteGeminiVectorStore).toHaveBeenCalledWith("old-store-id")
    expect(db.put).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "kb_1",
        config: { googleFileStoreId: "new-store-id" },
      })
    )
    expect(mockSyncKeyVectorStores).toHaveBeenCalled()

    // file_2 has no objectStoreKey — must be skipped
    expect(mockRemoveRagFileIngestionJob).toHaveBeenCalledTimes(2)
    expect(mockRemoveRagFileIngestionJob).toHaveBeenCalledWith("file_1")
    expect(mockRemoveRagFileIngestionJob).toHaveBeenCalledWith("file_3")

    expect(mockUpdateKnowledgeBaseFile).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "file_1",
        status: KnowledgeBaseFileStatus.PROCESSING,
        ragSourceId: undefined,
        errorMessage: undefined,
        processedAt: undefined,
      })
    )
    expect(mockUpdateKnowledgeBaseFile).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "file_3",
        status: KnowledgeBaseFileStatus.PROCESSING,
        ragSourceId: undefined,
      })
    )

    expect(mockEnqueueRagFileIngestion).toHaveBeenCalledTimes(2)
    expect(mockEnqueueRagFileIngestion).toHaveBeenCalledWith({
      workspaceId: "workspace_1",
      knowledgeBaseId: "kb_1",
      fileId: "file_1",
      objectStoreKey: "workspace_1/path/file1.txt",
    })
    expect(mockEnqueueRagFileIngestion).toHaveBeenCalledWith({
      workspaceId: "workspace_1",
      knowledgeBaseId: "kb_1",
      fileId: "file_3",
      objectStoreKey: "workspace_1/path/file3.txt",
    })
  })

  it("swallows 403 from deleteGeminiVectorStore and continues", async () => {
    const db = { put: jest.fn().mockResolvedValue({ rev: "2-abc" }) }
    mockGetWorkspaceDB.mockReturnValue(db)
    mockDeleteGeminiVectorStore.mockRejectedValue(
      Object.assign(new Error("Forbidden"), { status: 403 })
    )
    mockListKnowledgeBaseFiles.mockResolvedValue([])

    await expect(
      resetKnowledgeBaseStore(knowledgeBase as any)
    ).resolves.toBeUndefined()
    expect(db.put).toHaveBeenCalled()
    expect(mockSyncKeyVectorStores).toHaveBeenCalled()
  })

  it("swallows 404 from deleteGeminiVectorStore and continues", async () => {
    const db = { put: jest.fn().mockResolvedValue({ rev: "2-abc" }) }
    mockGetWorkspaceDB.mockReturnValue(db)
    mockDeleteGeminiVectorStore.mockRejectedValue(
      Object.assign(new Error("Not Found"), { status: 404 })
    )
    mockListKnowledgeBaseFiles.mockResolvedValue([])

    await expect(
      resetKnowledgeBaseStore(knowledgeBase as any)
    ).resolves.toBeUndefined()
    expect(db.put).toHaveBeenCalled()
    expect(mockSyncKeyVectorStores).toHaveBeenCalled()
  })

  it("rethrows non-403/404 errors from deleteGeminiVectorStore", async () => {
    mockDeleteGeminiVectorStore.mockRejectedValue(
      Object.assign(new Error("Internal Server Error"), { status: 500 })
    )

    await expect(
      resetKnowledgeBaseStore(knowledgeBase as any)
    ).rejects.toMatchObject({
      status: 500,
      message: "Internal Server Error",
    })
    expect(mockSyncKeyVectorStores).not.toHaveBeenCalled()
    expect(mockEnqueueRagFileIngestion).not.toHaveBeenCalled()
  })
})
