import { BudibaseQueue } from "./queue"
import * as logging from "../logging"
import { JobQueue } from "./constants"
import { helpers } from "@budibase/shared-core"

export class UnretriableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PermanentError"
  }
}

export interface QueuedProcessorOptions {
  maxAttempts?: number
  removeOnFail?: boolean
  removeOnComplete?: boolean
  maxStalledCount?: number
  waitForCompletionMs?: number
}

export abstract class QueuedProcessor<T> {
  private _queue: BudibaseQueue<T>
  private waitForCompletionMs: number

  constructor(queueType: JobQueue, options: QueuedProcessorOptions = {}) {
    const {
      maxAttempts = 3,
      removeOnFail = true,
      removeOnComplete = true,
      maxStalledCount = 3,
    } = options

    this.waitForCompletionMs = options.waitForCompletionMs || 10000

    this._queue = new BudibaseQueue<T>(queueType, {
      maxStalledCount,
      jobOptions: {
        attempts: maxAttempts,
        removeOnFail,
        removeOnComplete,
      },
    })

    this._queue.process(async (job, done) => {
      try {
        const result = await this.processFn(job.data)
        done?.(null, result)
      } catch (err: any) {
        if (err instanceof UnretriableError) {
          await job.discard()
        }
        logging.logAlert(`Failed to process job in ${this._queue.name}`, err)
        done?.(err)
      }
    })
  }

  async close(doNotWaitJobs?: boolean) {
    await this._queue.close(doNotWaitJobs)
  }

  protected abstract processFn: (data: T) => Promise<any>

  async execute(
    data: T
  ): Promise<
    { success: true; result: any } | { success: false; reason: "timeout" }
  > {
    try {
      const job = await this._queue.add(data)
      const result = await helpers.withTimeout(this.waitForCompletionMs, () =>
        job.finished()
      )
      return { success: true, result }
    } catch (err: any) {
      if (err.errno !== "ETIME") {
        throw err
      }

      return { success: false, reason: "timeout" }
    }
  }
}
