const mockGetWorkspaceId = jest.fn()
const mockFindKnowledgeBase = jest.fn()
const mockGetKnowledgeBaseFileOrThrow = jest.fn()
const mockUpdateKnowledgeBaseFile = jest.fn()
const mockEnqueueRagFileIngestion = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      getOrThrowWorkspaceId: (...args: any[]) => mockGetWorkspaceId(...args),
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

jest.mock("../rag/queue", () => ({
  enqueueRagFileIngestion: (...args: any[]) =>
    mockEnqueueRagFileIngestion(...args),
}))

import { KnowledgeBaseFileStatus } from "@budibase/types"
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
