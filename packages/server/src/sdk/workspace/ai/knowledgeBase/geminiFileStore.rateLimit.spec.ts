import nock from "nock"
import { withEnv } from "../../../../environment"
import { GeminiRateLimitError } from "../rag/geminiRateLimit"
import { ingestGeminiFile } from "./geminiFileStore"

jest.mock("../configs/litellm", () => ({
  getKeySettings: jest.fn().mockResolvedValue({ secretKey: "test-key" }),
}))

describe("Gemini ingestion rate limits", () => {
  const now = Date.parse("2026-09-22T12:00:00Z")
  const ingest = () =>
    withEnv(
      { GEMINI_API_KEY: "test-key", LITELLM_URL: "https://example.com" },
      () =>
        ingestGeminiFile({
          vectorStoreId: "store-1",
          filename: "notes.txt",
          buffer: Buffer.from("notes"),
        })
    )

  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(now)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    nock.cleanAll()
  })

  it.each([
    ["120", 120_000],
    ["Tue, 22 Sep 2026 12:03:00 GMT", 180_000],
    ["invalid", 60_000],
    ["-1", 60_000],
    ["1e100", 60_000],
    ["0", 1000],
    ["", 60_000],
  ])(
    "preserves the retry deadline for Retry-After %s",
    async (header, delay) => {
      nock("https://example.com")
        .post("/v1/rag/ingest")
        .reply(429, "Too many uploads", { "Retry-After": header })

      await expect(ingest()).rejects.toMatchObject({
        status: 429,
        retryAt: now + delay,
      })
    }
  )

  it("uses a one-minute cooldown when Retry-After is absent", async () => {
    nock("https://example.com")
      .post("/v1/rag/ingest")
      .reply(429, "Too many uploads")

    await expect(ingest()).rejects.toMatchObject({ retryAt: now + 60_000 })
  })

  it.each([
    "429 Too Many Requests",
    "Ingestion timed out",
    "Failed to upload document 429",
    "Storage quota exhausted",
    "403 Forbidden",
  ])("does not treat an ordinary failure as throttling: %s", async error => {
    nock("https://example.com")
      .post("/v1/rag/ingest")
      .reply(200, { status: "failed", error })

    await expect(ingest()).rejects.not.toBeInstanceOf(GeminiRateLimitError)
  })
})
