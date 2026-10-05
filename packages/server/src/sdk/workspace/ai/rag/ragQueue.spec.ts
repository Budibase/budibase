import type { Job } from "bull"
import { Readable } from "stream"
import { HTTPError } from "@budibase/backend-core"
import {
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
  type KnowledgeBaseFile,
} from "@budibase/types"
import { init, type RagIngestionJob } from "./ragQueue"

type Processor = (job: Job<RagIngestionJob>) => Promise<void>
const mockQueueProcess = jest.fn<Promise<void>, [number, Processor]>()
const mockFind = jest.fn()
const mockGetFile = jest.fn()
const mockUpdateFile = jest.fn()
const mockIngest = jest.fn()
const mockGetReadStream = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    objectStore: {
      ...actual.objectStore,
      getReadStream: () => mockGetReadStream(),
    },
    queue: {
      ...actual.queue,
      BudibaseQueue: jest.fn().mockImplementation(() => ({
        process: mockQueueProcess,
      })),
    },
  }
})

jest.mock("..", () => ({
  knowledgeBase: {
    find: () => mockFind(),
    getKnowledgeBaseFileOrThrow: () => mockGetFile(),
    updateKnowledgeBaseFile: (file: KnowledgeBaseFile) => mockUpdateFile(file),
  },
}))

jest.mock("./files", () => ({
  ingestKnowledgeBaseFile: () => mockIngest(),
}))

describe("RAG ingestion retries", () => {
  let processJob: Processor
  let file: KnowledgeBaseFile

  const makeJob = ({
    attemptsMade = 0,
  }: {
    attemptsMade?: number
  } = {}) => {
    const job: Partial<Job<RagIngestionJob>> = {
      id: "file-1",
      data: {
        workspaceId: "app_dev_test",
        knowledgeBaseId: "kb-1",
        fileId: "file-1",
      },
      opts: { attempts: 5, timeout: 600_000 },
      attemptsMade,
      discard: jest.fn(),
    }
    return job as Job<RagIngestionJob>
  }

  beforeAll(async () => {
    await init()
    processJob = mockQueueProcess.mock.calls[0][1]
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockFind.mockResolvedValue({
      _id: "kb-1",
      name: "Knowledge",
      type: KnowledgeBaseType.GEMINI,
      config: { googleFileStoreId: "store-1" },
    })
    file = {
      _id: "file-1",
      knowledgeBaseId: "kb-1",
      filename: "notes.txt",
      objectStoreKey: "notes.txt",
      uploadedBy: "user-1",
      status: KnowledgeBaseFileStatus.PROCESSING,
    }
    mockGetFile.mockResolvedValue(file)
    mockGetReadStream.mockImplementation(async () => ({
      stream: Readable.from([Buffer.from("notes")]),
    }))
    mockIngest.mockResolvedValue(undefined)
  })

  it.each([429, 503])("keeps retrying HTTP %s failures", async status => {
    const job = makeJob()
    mockIngest.mockRejectedValue(new HTTPError("Temporary failure", status))

    await expect(processJob(job)).rejects.toThrow("Temporary failure")

    expect(mockUpdateFile).not.toHaveBeenCalled()
    expect(job.discard).not.toHaveBeenCalled()
  })

  it.each([403, 404])(
    "fails immediately on an HTTP %s store access error",
    async status => {
      const job = makeJob()
      const message = "Use 'Reset store' to recreate it."
      mockIngest.mockRejectedValue(new HTTPError(message, status))

      await expect(processJob(job)).rejects.toThrow(message)

      expect(mockUpdateFile).toHaveBeenCalledWith(
        expect.objectContaining({
          status: KnowledgeBaseFileStatus.FAILED,
          errorMessage: message,
        })
      )
      expect(job.discard).toHaveBeenCalled()
    }
  )

  it("fails on the fifth retryable failure", async () => {
    const job = makeJob({ attemptsMade: 4 })
    mockIngest.mockRejectedValue(new Error("Upload failed"))

    await expect(processJob(job)).rejects.toThrow("Upload failed")

    expect(mockUpdateFile).toHaveBeenCalledWith(
      expect.objectContaining({
        status: KnowledgeBaseFileStatus.FAILED,
        errorMessage: "Upload failed",
      })
    )
    expect(job.discard).not.toHaveBeenCalled()
  })

  it("discards a removed file when its delayed job resumes", async () => {
    mockGetFile.mockRejectedValue(
      Object.assign(new Error("Missing"), { status: 404 })
    )
    const job = makeJob()

    await processJob(job)

    expect(job.discard).toHaveBeenCalled()
    expect(mockIngest).not.toHaveBeenCalled()
  })
})
