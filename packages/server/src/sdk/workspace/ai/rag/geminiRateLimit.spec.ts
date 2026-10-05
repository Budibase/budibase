import { randomUUID } from "crypto"
import { RedisClient } from "@budibase/backend-core"
import {
  extendGeminiIngestionCooldown,
  getGeminiBackoffMs,
  throwIfGeminiIngestionCoolingDown,
} from "./geminiRateLimit"

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
  }
})

describe("Gemini ingestion backoff", () => {
  it.each([
    [1, 60_000],
    [2, 120_000],
    [3, 240_000],
    [4, 300_000],
    [5, 300_000],
    [1025, 300_000],
    [Number.MAX_SAFE_INTEGER, 300_000],
  ])(
    "backs off after %s rate-limit responses for %s ms",
    (rateLimitResponses, delay) => {
      expect(getGeminiBackoffMs({ rateLimitResponses })).toBe(delay)
    }
  )
})

describe("shared Gemini ingestion cooldown", () => {
  let client: RedisClient

  beforeEach(async () => {
    client = await RedisClient.init(randomUUID())
    mockGetCacheClient.mockResolvedValue(client)
  })

  afterEach(async () => {
    await client.clear()
    await client.finish()
    jest.restoreAllMocks()
  })

  it("preserves the longest cooldown across concurrent updates", async () => {
    const now = Date.now()
    const retryAt = now + 120_000
    await Promise.all([
      extendGeminiIngestionCooldown({ retryAt }),
      extendGeminiIngestionCooldown({ retryAt: now + 60_000 }),
    ])

    await expect(throwIfGeminiIngestionCoolingDown()).rejects.toMatchObject({
      retryAt,
    })
  })

  it("allows ingestion after the deadline", async () => {
    const retryAt = Date.now() + 60_000
    await extendGeminiIngestionCooldown({ retryAt })
    jest.spyOn(Date, "now").mockReturnValue(retryAt + 1)

    await expect(throwIfGeminiIngestionCoolingDown()).resolves.toBeUndefined()
  })

  it("allows ingestion when no cooldown has been recorded", async () => {
    await expect(throwIfGeminiIngestionCoolingDown()).resolves.toBeUndefined()
  })
})
