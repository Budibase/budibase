import Bull, { type Job } from "bull"
import { randomUUID } from "crypto"
import { Readable } from "stream"
import { GenericContainer, type StartedTestContainer } from "testcontainers"
import { env, RedisClient } from "@budibase/backend-core"
import {
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
  type KnowledgeBaseFile,
} from "@budibase/types"
import * as rateLimit from "./geminiRateLimit"
import { init, type RagIngestionJob } from "./ragQueue"

type Processor = (job: Job<RagIngestionJob>) => Promise<void>
const mockQueueProcess = jest.fn<Promise<void>, [number, Processor]>()
const mockFind = jest.fn()
const mockGetFile = jest.fn()
const mockUpdateFile = jest.fn()
const mockIngest = jest.fn()
const mockGetReadStream = jest.fn()
const mockGetCacheClient = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    redis: {
      ...actual.redis,
      clients: {
        ...actual.redis.clients,
        getCacheClient: () => mockGetCacheClient(),
      },
    },
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

jest.mock("./geminiRateLimit", () => ({
  ...jest.requireActual("./geminiRateLimit"),
  throwIfGeminiIngestionCoolingDown: jest.fn(),
  extendGeminiIngestionCooldown: jest.fn(),
}))

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
    rateLimitDeferrals = 0,
  }: {
    attemptsMade?: number
    rateLimitDeferrals?: number
  } = {}) => {
    const job: Partial<Job<RagIngestionJob>> = {
      id: "file-1",
      data: {
        workspaceId: "app_dev_test",
        knowledgeBaseId: "kb-1",
        fileId: "file-1",
        rateLimitDeferrals,
      },
      opts: { attempts: 5, timeout: 600_000 },
      attemptsMade,
      discard: jest.fn(),
      update: jest.fn(async (data: RagIngestionJob) => {
        job.data = data
      }),
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
    jest.mocked(rateLimit.throwIfGeminiIngestionCoolingDown).mockResolvedValue()
    jest
      .mocked(rateLimit.extendGeminiIngestionCooldown)
      .mockImplementation(async ({ retryAt }) => retryAt)
    jest.spyOn(Math, "random").mockReturnValue(0.5)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("keeps throttling beyond five attempts outside the failure budget", async () => {
    const now = Date.now()
    jest.spyOn(Date, "now").mockReturnValue(now)
    const job = makeJob({ attemptsMade: 12, rateLimitDeferrals: 12 })
    mockIngest.mockRejectedValue(
      new rateLimit.GeminiRateLimitError({ retryAt: now + 60_000 })
    )

    await expect(processJob(job)).rejects.toBeInstanceOf(
      rateLimit.GeminiRateLimitError
    )

    expect(file.status).toBe(KnowledgeBaseFileStatus.PROCESSING)
    expect(mockUpdateFile).not.toHaveBeenCalled()
    expect(job.data.rateLimitDeferrals).toBe(13)
    expect(job.opts).toMatchObject({
      attempts: 18,
      backoff: { type: "fixed", delay: 60_500 },
      stackTraceLimit: 10,
    })
  })

  it("defers another job during cooldown without reading or uploading it", async () => {
    const now = Date.now()
    jest.spyOn(Date, "now").mockReturnValue(now)
    jest
      .mocked(rateLimit.throwIfGeminiIngestionCoolingDown)
      .mockRejectedValue(
        new rateLimit.GeminiRateLimitError({ retryAt: now + 1_200_000 })
      )
    const job = makeJob()

    await expect(processJob(job)).rejects.toBeInstanceOf(
      rateLimit.GeminiRateLimitError
    )

    expect(mockGetReadStream).not.toHaveBeenCalled()
    expect(mockIngest).not.toHaveBeenCalled()
    expect(job.opts).toMatchObject({
      timeout: 600_000,
      attempts: 6,
      backoff: { type: "fixed", delay: 1_200_500 },
    })
    expect(file.status).toBe(KnowledgeBaseFileStatus.PROCESSING)
  })

  it("rechecks the cooldown after loading the file", async () => {
    jest
      .mocked(rateLimit.throwIfGeminiIngestionCoolingDown)
      .mockResolvedValueOnce()
      .mockRejectedValueOnce(
        new rateLimit.GeminiRateLimitError({ retryAt: Date.now() + 60_000 })
      )

    await expect(processJob(makeJob())).rejects.toBeInstanceOf(
      rateLimit.GeminiRateLimitError
    )

    expect(mockIngest).not.toHaveBeenCalled()
    expect(file.status).toBe(KnowledgeBaseFileStatus.PROCESSING)
  })

  it("restores the ordinary backoff using only non-throttling attempts", async () => {
    const job = makeJob({ attemptsMade: 8, rateLimitDeferrals: 7 })
    mockIngest.mockRejectedValue(new Error("Upload failed"))

    await expect(processJob(job)).rejects.toThrow("Upload failed")

    expect(job.opts.backoff).toEqual({ type: "fixed", delay: 30_000 })
    expect(file.status).toBe(KnowledgeBaseFileStatus.PROCESSING)
    expect(mockUpdateFile).not.toHaveBeenCalled()
  })

  it("fails on the fifth ordinary failure even after many deferrals", async () => {
    const job = makeJob({ attemptsMade: 24, rateLimitDeferrals: 20 })
    mockIngest.mockRejectedValue(new Error("Upload failed"))

    await expect(processJob(job)).rejects.toThrow("Upload failed")

    expect(mockUpdateFile).toHaveBeenCalledWith(
      expect.objectContaining({
        status: KnowledgeBaseFileStatus.FAILED,
        errorMessage: "Upload failed",
      })
    )
    expect(job.opts.attempts).toBe(25)
  })

  it("discards a removed file when its delayed job resumes", async () => {
    mockGetFile.mockRejectedValue(
      Object.assign(new Error("Missing"), { status: 404 })
    )
    const job = makeJob({ attemptsMade: 6, rateLimitDeferrals: 6 })

    await processJob(job)

    expect(job.discard).toHaveBeenCalled()
    expect(mockIngest).not.toHaveBeenCalled()
  })

  describe("with Bull and Redis", () => {
    let container: StartedTestContainer | undefined
    let connection: { host: string; port: number }
    let cache: RedisClient
    let queueName: string
    let queues: Bull.Queue<RagIngestionJob>[]
    const previousEnv = {
      MOCK_REDIS: env.MOCK_REDIS,
      REDIS_URL: env.REDIS_URL,
      REDIS_PASSWORD: env.REDIS_PASSWORD,
      REDIS_USERNAME: env.REDIS_USERNAME,
    }

    const createQueue = () => {
      const queue = new Bull<RagIngestionJob>(queueName, {
        redis: connection,
        defaultJobOptions: { attempts: 5, timeout: 500 },
      })
      queues.push(queue)
      return queue
    }

    beforeAll(async () => {
      if (process.env.BULL_TEST_REDIS_PORT) {
        connection = {
          host: "127.0.0.1",
          port: Number(process.env.BULL_TEST_REDIS_PORT),
        }
      } else {
        container = await new GenericContainer("redis")
          .withExposedPorts(6379)
          .start()
        connection = {
          host: container.getHost(),
          port: container.getMappedPort(6379),
        }
      }
      env._set("MOCK_REDIS", false)
      env._set("REDIS_URL", `${connection.host}:${connection.port}`)
      env._set("REDIS_PASSWORD", "")
      env._set("REDIS_USERNAME", "")
    })

    afterAll(async () => {
      for (const [key, value] of Object.entries(previousEnv)) {
        env._set(key, value)
      }
      await container?.stop()
    })

    beforeEach(async () => {
      const actual =
        jest.requireActual<typeof import("./geminiRateLimit")>(
          "./geminiRateLimit"
        )
      jest
        .mocked(rateLimit.throwIfGeminiIngestionCoolingDown)
        .mockImplementation(actual.throwIfGeminiIngestionCoolingDown)
      jest
        .mocked(rateLimit.extendGeminiIngestionCooldown)
        .mockImplementation(actual.extendGeminiIngestionCooldown)
      jest.spyOn(Math, "random").mockReturnValue(0)
      cache = await RedisClient.init(`rag-test-${randomUUID()}`)
      mockGetCacheClient.mockResolvedValue(cache)
      queueName = `rag-test-${randomUUID()}`
      queues = []
    })

    afterEach(async () => {
      const cleanupQueue = createQueue()
      await cleanupQueue.obliterate({ force: true })
      await Promise.all(queues.map(queue => queue.close(true)))
      await cache.clear()
      await cache.finish()
    })

    it("completes after more than five rate limits with delays exceeding the active timeout", async () => {
      let calls = 0
      mockIngest.mockImplementation(async () => {
        calls++
        if (calls <= 6) {
          throw new rateLimit.GeminiRateLimitError({
            retryAt: Date.now() + 1000,
          })
        }
        file.status = KnowledgeBaseFileStatus.READY
      })
      const queue = createQueue()
      queue.process(2, processJob)
      const job = await queue.add(makeJob().data, { jobId: "file-1" })

      await job.finished()

      expect(await job.getState()).toBe("completed")
      expect(file.status).toBe(KnowledgeBaseFileStatus.READY)
      expect(mockUpdateFile).not.toHaveBeenCalled()
      expect(calls).toBe(7)
      expect((await queue.getJob(job.id))?.data.rateLimitDeferrals).toBe(6)
    }, 30_000)

    it("preserves delayed retries and the shared cooldown when a worker restarts", async () => {
      const uploadTimes: number[] = []
      mockIngest.mockImplementation(async () => {
        uploadTimes.push(Date.now())
        if (uploadTimes.length === 1) {
          throw new rateLimit.GeminiRateLimitError({
            retryAt: Date.now() + 1200,
          })
        }
        file.status = KnowledgeBaseFileStatus.READY
      })
      const firstWorker = createQueue()
      const deferred = new Promise<void>(resolve => {
        firstWorker.once("failed", () => resolve())
      })
      firstWorker.process(1, processJob)
      await firstWorker.add(makeJob().data, { jobId: "file-1" })
      await deferred
      await firstWorker.close()

      const secondWorker = createQueue()
      const originalJob = await secondWorker.getJob("file-1")
      const otherJob = await secondWorker.add(
        { ...makeJob().data, workspaceId: "app_dev_other", fileId: "file-2" },
        { jobId: "file-2" }
      )
      secondWorker.process(2, processJob)
      await Promise.all([originalJob!.finished(), otherJob.finished()])

      expect(file.status).toBe(KnowledgeBaseFileStatus.READY)
      expect(mockUpdateFile).not.toHaveBeenCalled()
      expect(uploadTimes).toHaveLength(3)
      expect(
        uploadTimes.slice(1).every(time => time >= uploadTimes[0] + 1200)
      ).toBe(true)
      expect(
        (await secondWorker.getJob("file-1"))?.data.rateLimitDeferrals
      ).toBe(1)
      expect(
        (await secondWorker.getJob("file-2"))?.data.rateLimitDeferrals
      ).toBe(1)
    }, 30_000)
  })
})
