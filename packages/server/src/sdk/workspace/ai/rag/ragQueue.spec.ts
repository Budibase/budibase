import { Readable } from "stream"
import type { Job } from "bull"
import type { RagIngestionJob } from "./ragQueue"

const mockQueueProcess = jest.fn()
const mockQueueOn = jest.fn()
const mockGetJob = jest.fn()
const mockFindKnowledgeBase = jest.fn()
const mockGetKnowledgeBaseFile = jest.fn()
const mockGetReadStream = jest.fn()
const mockIngestKnowledgeBaseFile = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")

  class MockBudibaseQueue {
    process = (
      concurrency: number,
      handler: (job: Job<RagIngestionJob>) => Promise<void>
    ) => mockQueueProcess(concurrency, handler)

    add = jest.fn()

    getBullQueue = () => ({
      on: (event: string, handler: (jobId: string, progress: string) => void) =>
        mockQueueOn(event, handler),
      getJob: (jobId: string) => mockGetJob(jobId),
    })
  }

  return {
    ...actual,
    context: {
      ...actual.context,
      doInWorkspaceContext: async (
        _workspaceId: string,
        fn: () => Promise<void>
      ) => await fn(),
    },
    objectStore: {
      ...actual.objectStore,
      getReadStream: () => mockGetReadStream(),
    },
    queue: {
      ...actual.queue,
      BudibaseQueue: MockBudibaseQueue,
    },
  }
})

jest.mock("..", () => ({
  knowledgeBase: {
    find: (knowledgeBaseId: string) => mockFindKnowledgeBase(knowledgeBaseId),
    getKnowledgeBaseFileOrThrow: (fileId: string) =>
      mockGetKnowledgeBaseFile(fileId),
  },
}))

jest.mock("./files", () => ({
  ingestKnowledgeBaseFile: (
    ...args: Parameters<typeof mockIngestKnowledgeBaseFile>
  ) => mockIngestKnowledgeBaseFile(...args),
}))

import { KnowledgeBaseFileStatus, KnowledgeBaseType } from "@budibase/types"
import { getQueue, init, removeRagFileIngestionJob } from "./ragQueue"
import { QUEUE_JOB_CANCELLATION_PROGRESS } from "./queueCancellation"

describe("RAG ingestion queue cancellation", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockQueueProcess.mockResolvedValue(undefined)
    mockQueueOn.mockReturnValue(undefined)
    mockFindKnowledgeBase.mockResolvedValue({
      _id: "kb_1",
      name: "Support docs",
      type: KnowledgeBaseType.GEMINI,
      config: { googleFileStoreId: "store_1" },
    })
    mockGetKnowledgeBaseFile.mockResolvedValue({
      _id: "kb_file_1",
      knowledgeBaseId: "kb_1",
      filename: "notes.txt",
      objectStoreKey: "objects/notes.txt",
      status: KnowledgeBaseFileStatus.PROCESSING,
      uploadedBy: "sharepoint:source_1",
    })
    mockGetReadStream.mockResolvedValue({
      stream: Readable.from([Buffer.from("notes")]),
    })
  })

  it("aborts and discards an active ingestion job", async () => {
    let ingestStarted!: () => void
    const ingestStartedPromise = new Promise<void>(resolve => {
      ingestStarted = resolve
    })
    mockIngestKnowledgeBaseFile.mockImplementation(
      (_knowledgeBase, _file, _buffer, signal: AbortSignal) => {
        ingestStarted()
        return new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () => reject(signal.reason), {
            once: true,
          })
        })
      }
    )

    init()
    const processHandler = mockQueueProcess.mock.calls[0][1]
    const discard = jest.fn()
    const processing = processHandler({
      id: "kb_file_1",
      data: {
        workspaceId: "app_dev_test",
        knowledgeBaseId: "kb_1",
        fileId: "kb_file_1",
        objectStoreKey: "objects/notes.txt",
      },
      progress: jest.fn().mockReturnValue(undefined),
      discard,
      attemptsMade: 0,
      opts: { attempts: 5 },
    })
    await ingestStartedPromise

    const progressHandler = mockQueueOn.mock.calls.find(
      ([event]) => event === "global:progress"
    )?.[1]
    progressHandler("kb_file_1", QUEUE_JOB_CANCELLATION_PROGRESS)

    await processing
    expect(discard).toHaveBeenCalled()
  })

  it("signals an active job and waits for it during deletion", async () => {
    getQueue()
    const remove = jest.fn().mockRejectedValue(new Error("active job"))
    const progress = jest.fn().mockResolvedValue(undefined)
    const finished = jest.fn().mockResolvedValue(undefined)
    mockGetJob.mockResolvedValue({ remove, progress, finished })

    await removeRagFileIngestionJob("kb_file_1", true)

    expect(progress).toHaveBeenCalledWith(QUEUE_JOB_CANCELLATION_PROGRESS)
    expect(finished).toHaveBeenCalled()
  })
})
