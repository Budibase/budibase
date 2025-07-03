import { QueuedProcessor, JobQueue } from "../../src/queue"
import { generator } from "../core/utilities"
import { useRealQueues } from "../core/utilities/utils/queue"

interface TestData {
  id: string
  value: string
}

class TestProcessor extends QueuedProcessor<TestData> {
  processFn = jest.fn()

  constructor(options = {}) {
    super(generator.guid() as JobQueue, options)
  }
}

describe("QueuedProcessor", () => {
  let processor: TestProcessor

  beforeAll(async () => {
    await useRealQueues()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(async () => {
    await processor.close()
  })

  describe("execute", () => {
    const testData: TestData = { id: "test-id", value: "test-value" }

    beforeEach(() => {
      processor = new TestProcessor({ waitForCompletionMs: 1000 })
    })

    it("should return success when job completes successfully", async () => {
      const expectedResult = { message: "success" }
      processor.processFn.mockResolvedValue(expectedResult)

      const result = await processor.execute(testData)

      expect(processor.processFn).toHaveBeenCalledWith(testData)
      expect(result).toEqual({ success: true, result: expectedResult })
    })

    it("should return timeout when job times out", async () => {
      const processor = new TestProcessor({ waitForCompletionMs: 10 })
      processor.processFn.mockResolvedValue(new Promise(() => {})) // Never resolves

      const result = await processor.execute(testData)

      expect(result).toEqual({ success: false, reason: "timeout" })
    })

    it("should throw job processing errors", async () => {
      const jobError = new Error("Job processing failed")
      processor.processFn.mockRejectedValue(jobError)

      await expect(processor.execute(testData)).rejects.toThrow(
        "Job processing failed"
      )
    })
  })

  describe("integration tests", () => {
    beforeEach(() => {
      processor = new TestProcessor({ waitForCompletionMs: 5000 })
    })

    it("should process multiple jobs sequentially", async () => {
      processor.processFn
        .mockResolvedValueOnce({ result: "job1" })
        .mockResolvedValueOnce({ result: "job2" })
        .mockResolvedValueOnce({ result: "job3" })

      const results = await Promise.all([
        processor.execute({ id: "1", value: "test1" }),
        processor.execute({ id: "2", value: "test2" }),
        processor.execute({ id: "3", value: "test3" }),
      ])

      expect(results).toEqual([
        { success: true, result: { result: "job1" } },
        { success: true, result: { result: "job2" } },
        { success: true, result: { result: "job3" } },
      ])
      expect(processor.processFn).toHaveBeenCalledTimes(3)
    })

    it.only("should handle mixed success and failure jobs", async () => {
      processor.processFn
        .mockRejectedValueOnce(new Error("failed"))
        .mockResolvedValueOnce({ result: "success" })

      const result = await processor.execute({ id: "1", value: "test1" })

      expect(processor.processFn).toHaveBeenCalledTimes(2)
      expect(result).toEqual({ success: true, result: { result: "success" } })
    })
  })
})
