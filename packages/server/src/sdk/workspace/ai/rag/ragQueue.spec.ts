import Bull, { type Job } from "bull"
import { randomUUID } from "crypto"
import { Readable } from "stream"
import { GenericContainer, type StartedTestContainer } from "testcontainers"
import { env, HTTPError, RedisClient } from "@budibase/backend-core"
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
  getGeminiBackoffMs: jest.fn(),
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
    rateLimitResponses,
  }: {
    attemptsMade?: number
    rateLimitDeferrals?: number
    rateLimitResponses?: number
  } = {}) => {
    const job: Partial<Job<RagIngestionJob>> = {
      id: "file-1",
      data: {
        workspaceId: "app_dev_test",
        knowledgeBaseId: "kb-1",
        fileId: "file-1",
        rateLimitDeferrals,
        rateLimitResponses,
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
    const actual =
      jest.requireActual<typeof import("./geminiRateLimit")>(
        "./geminiRateLimit"
      )
    jest
      .mocked(rateLimit.getGeminiBackoffMs)
      .mockImplementation(actual.getGeminiBackoffMs)
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

  it("keeps throttling beyond five attempts outside the failure budget", async () => {
    const now = Date.now()
    jest.spyOn(Date, "now").mockReturnValue(now)
    const job = makeJob({
      attemptsMade: 12,
      rateLimitDeferrals: 12,
      rateLimitResponses: 12,
    })
    mockIngest.mockRejectedValue(
      new rateLimit.GeminiRateLimitError({ retryAt: now + 60_000 })
    )

    await expect(processJob(job)).rejects.toBeInstanceOf(
      rateLimit.GeminiRateLimitError
    )

    expect(file.status).toBe(KnowledgeBaseFileStatus.PROCESSING)
    expect(mockUpdateFile).not.toHaveBeenCalled()
    expect(job.data.rateLimitDeferrals).toBe(13)
    expect(job.data.rateLimitResponses).toBe(13)
    expect(job.opts).toMatchObject({
      attempts: 18,
      backoff: { type: "fixed", delay: 300_500 },
      stackTraceLimit: 10,
    })
  })

  it.each<[number | undefined, number, number]>([
    [undefined, 1, 60_000],
    [1, 2, 120_000],
    [2, 3, 240_000],
    [3, 4, 300_000],
    [1000, 1001, 300_000],
  ])(
    "backs off after %s previous responses independently of cooldown deferrals",
    async (rateLimitResponses, expectedResponses, delay) => {
      const now = Date.now()
      jest.spyOn(Date, "now").mockReturnValue(now)
      const job = makeJob({
        attemptsMade: 2000,
        rateLimitDeferrals: 2000,
        rateLimitResponses,
      })
      mockIngest.mockRejectedValue(
        new rateLimit.GeminiRateLimitError({ retryAt: now + 1000 })
      )

      await expect(processJob(job)).rejects.toBeInstanceOf(
        rateLimit.GeminiRateLimitError
      )

      expect(job.data.rateLimitResponses).toBe(expectedResponses)
      expect(rateLimit.extendGeminiIngestionCooldown).toHaveBeenCalledWith({
        retryAt: now + delay,
      })
      expect(job.opts.backoff).toEqual({ type: "fixed", delay: delay + 500 })
      expect(file.status).toBe(KnowledgeBaseFileStatus.PROCESSING)
    }
  )

  it("honours provider deadlines longer than the backoff cap", async () => {
    const now = Date.now()
    jest.spyOn(Date, "now").mockReturnValue(now)
    const job = makeJob({ rateLimitResponses: 12 })
    mockIngest.mockRejectedValue(
      new rateLimit.GeminiRateLimitError({ retryAt: now + 1_200_000 })
    )

    await expect(processJob(job)).rejects.toBeInstanceOf(
      rateLimit.GeminiRateLimitError
    )

    expect(rateLimit.extendGeminiIngestionCooldown).toHaveBeenCalledWith({
      retryAt: now + 1_200_000,
    })
    expect(job.opts.backoff).toEqual({ type: "fixed", delay: 1_200_500 })
  })

  it("honours a longer shared cooldown after an ingestion rate limit", async () => {
    const now = Date.now()
    jest.spyOn(Date, "now").mockReturnValue(now)
    const job = makeJob()
    mockIngest.mockRejectedValue(
      new rateLimit.GeminiRateLimitError({ retryAt: now + 60_000 })
    )
    jest
      .mocked(rateLimit.extendGeminiIngestionCooldown)
      .mockResolvedValue(now + 1_200_000)

    await expect(processJob(job)).rejects.toBeInstanceOf(
      rateLimit.GeminiRateLimitError
    )

    expect(job.opts.backoff).toEqual({ type: "fixed", delay: 1_200_500 })
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
    expect(rateLimit.extendGeminiIngestionCooldown).not.toHaveBeenCalled()
    expect(job.data.rateLimitResponses).toBe(0)
    expect(job.opts).toMatchObject({
      timeout: 600_000,
      attempts: 6,
      backoff: { type: "fixed", delay: 1_200_500 },
    })
    expect(file.status).toBe(KnowledgeBaseFileStatus.PROCESSING)
  })

  it("rechecks the cooldown after loading the file", async () => {
    const now = Date.now()
    jest.spyOn(Date, "now").mockReturnValue(now)
    const job = makeJob({ rateLimitResponses: 3 })
    jest
      .mocked(rateLimit.throwIfGeminiIngestionCoolingDown)
      .mockResolvedValueOnce()
      .mockRejectedValueOnce(
        new rateLimit.GeminiRateLimitError({ retryAt: now + 60_000 })
      )

    await expect(processJob(job)).rejects.toBeInstanceOf(
      rateLimit.GeminiRateLimitError
    )

    expect(mockIngest).not.toHaveBeenCalled()
    expect(rateLimit.extendGeminiIngestionCooldown).not.toHaveBeenCalled()
    expect(job.data.rateLimitResponses).toBe(3)
    expect(job.opts.backoff).toEqual({ type: "fixed", delay: 60_500 })
    expect(file.status).toBe(KnowledgeBaseFileStatus.PROCESSING)
  })

  it("restores the ordinary backoff using only non-throttling attempts", async () => {
    const job = makeJob({
      attemptsMade: 8,
      rateLimitDeferrals: 7,
      rateLimitResponses: 3,
    })
    mockIngest.mockRejectedValue(new Error("Upload failed"))

    await expect(processJob(job)).rejects.toThrow("Upload failed")

    expect(job.opts.backoff).toEqual({ type: "fixed", delay: 30_000 })
    expect(job.data.rateLimitResponses).toBe(3)
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
      jest.mocked(rateLimit.getGeminiBackoffMs).mockReturnValue(1000)
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
      expect((await queue.getJob(job.id))?.data.rateLimitResponses).toBe(6)
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
      expect(
        (await secondWorker.getJob("file-1"))?.data.rateLimitResponses
      ).toBe(1)
      expect(
        (await secondWorker.getJob("file-2"))?.data.rateLimitResponses
      ).toBe(0)
    }, 30_000)

    it("continues increasing backoff after a worker restart", async () => {
      jest
        .mocked(rateLimit.getGeminiBackoffMs)
        .mockImplementation(
          ({ rateLimitResponses }) => rateLimitResponses * 1000
        )
      const uploadTimes: number[] = []
      mockIngest.mockImplementation(async () => {
        uploadTimes.push(Date.now())
        if (uploadTimes.length <= 2) {
          throw new rateLimit.GeminiRateLimitError({ retryAt: Date.now() })
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
      const job = await secondWorker.getJob("file-1")
      secondWorker.process(1, processJob)
      await job!.finished()

      expect(await job!.getState()).toBe("completed")
      expect(file.status).toBe(KnowledgeBaseFileStatus.READY)
      expect(mockUpdateFile).not.toHaveBeenCalled()
      expect(uploadTimes).toHaveLength(3)
      expect(uploadTimes[1] - uploadTimes[0]).toBeGreaterThanOrEqual(1000)
      expect(uploadTimes[2] - uploadTimes[1]).toBeGreaterThanOrEqual(2000)
      expect(rateLimit.getGeminiBackoffMs).toHaveBeenNthCalledWith(1, {
        rateLimitResponses: 1,
      })
      expect(rateLimit.getGeminiBackoffMs).toHaveBeenNthCalledWith(2, {
        rateLimitResponses: 2,
      })
      expect((await secondWorker.getJob("file-1"))?.data).toMatchObject({
        rateLimitDeferrals: 2,
        rateLimitResponses: 2,
      })
    }, 30_000)
  })
})
