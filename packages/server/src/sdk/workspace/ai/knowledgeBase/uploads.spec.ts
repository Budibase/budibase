const mockGetWorkspaceId = jest.fn()
const mockFindKnowledgeBase = jest.fn()
const mockGetKnowledgeBaseFileOrThrow = jest.fn()
const mockUpdateKnowledgeBaseFile = jest.fn()
const mockEnqueueRagFileIngestion = jest.fn()
const mockObjectStoreUpload = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      getOrThrowWorkspaceId: (...args: any[]) => mockGetWorkspaceId(...args),
    },
    objectStore: {
      ...actual.objectStore,
      upload: (...args: any[]) => mockObjectStoreUpload(...args),
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
}))

jest.mock("../rag/ragQueue", () => ({
  enqueueRagFileIngestion: (...args: any[]) =>
    mockEnqueueRagFileIngestion(...args),
}))

import { KnowledgeBaseFileStatus } from "@budibase/types"
import { createKnowledgeBaseFile } from "./files"
import {
  retryKnowledgeBaseFileIngestion,
  uploadKnowledgeBaseFile,
} from "./uploads"

describe("knowledgeBase uploads", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetWorkspaceId.mockReturnValue("workspace_1")
    mockUpdateKnowledgeBaseFile.mockResolvedValue(undefined)
    mockEnqueueRagFileIngestion.mockResolvedValue(undefined)
    mockObjectStoreUpload.mockResolvedValue(undefined)
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

  it("marks supported images as ready without queueing ingestion", async () => {
    mockFindKnowledgeBase.mockResolvedValue({ _id: "kb_1" })
    ;(createKnowledgeBaseFile as jest.Mock).mockResolvedValue({
      _id: "kb_file_2",
      knowledgeBaseId: "kb_1",
      filename: "diagram.png",
      objectStoreKey: "workspace_1/path/diagram.png",
      ragSourceId: "kb_file_2",
      status: KnowledgeBaseFileStatus.PROCESSING,
      uploadedBy: "user_1",
    })

    await uploadKnowledgeBaseFile({
      knowledgeBaseId: "kb_1",
      filename: "diagram.png",
      mimetype: "image/png",
      buffer: Buffer.from("img"),
      uploadedBy: "user_1",
    })

    expect(mockObjectStoreUpload).toHaveBeenCalled()
    expect(mockEnqueueRagFileIngestion).not.toHaveBeenCalled()
    expect(mockUpdateKnowledgeBaseFile).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "kb_file_2",
        status: KnowledgeBaseFileStatus.READY,
        errorMessage: undefined,
      })
    )
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

  it("marks failed image files ready on retry without queueing", async () => {
    mockGetKnowledgeBaseFileOrThrow.mockResolvedValue({
      _id: "kb_file_3",
      knowledgeBaseId: "kb_1",
      filename: "image.webp",
      mimetype: "image/webp",
      objectStoreKey: "workspace_1/path/image.webp",
      status: KnowledgeBaseFileStatus.FAILED,
      errorMessage: "ingest failed",
    })

    await retryKnowledgeBaseFileIngestion("kb_file_3")

    expect(mockEnqueueRagFileIngestion).not.toHaveBeenCalled()
    expect(mockUpdateKnowledgeBaseFile).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "kb_file_3",
        status: KnowledgeBaseFileStatus.READY,
        errorMessage: undefined,
      })
    )
  })
})
