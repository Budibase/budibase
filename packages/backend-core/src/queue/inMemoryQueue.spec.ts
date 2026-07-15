import InMemoryQueue from "./inMemoryQueue"
import type { Job } from "bull"

describe("InMemoryQueue", () => {
  it("emits progress for an active job and exposes it by configured id", async () => {
    const queue = new InMemoryQueue<{ value: string }>("test_queue", {
      defaultJobOptions: { removeOnComplete: true },
    })
    let processingStarted!: () => void
    const processingStartedPromise = new Promise<void>(resolve => {
      processingStarted = resolve
    })
    let releaseProcessing!: () => void
    const processingReleased = new Promise<void>(resolve => {
      releaseProcessing = resolve
    })
    const progressHandler = jest.fn()
    queue.on("global:progress", progressHandler)
    await queue.process(async (_job: Job<{ value: string }>) => {
      processingStarted()
      await processingReleased
    })

    const added = await queue.add(
      { value: "test" },
      { jobId: "configured_job_id" }
    )
    await processingStartedPromise
    const activeJob = await queue.getJob("configured_job_id")

    expect(activeJob).toBeDefined()
    await expect(activeJob!.remove()).rejects.toThrow(
      "Could not remove job configured_job_id"
    )
    await activeJob!.progress("cancelled")
    expect(progressHandler).toHaveBeenCalledWith(
      "configured_job_id",
      "cancelled"
    )

    const finished = added!.finished()
    releaseProcessing()
    await finished
  })
})
