import { BudibaseQueue } from "./queue"
import * as logging from "../logging"
import { JobQueue } from "./constants"
import { helpers } from "@budibase/shared-core"

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

    this._queue.process(async job => {
      try {
        const result = await this.processFn(job.data)
        return result
      } catch (err: any) {
        logging.logAlert(`Failed to process job in ${this._queue.name}`, err)
        throw err
      }
    })
  }

  abstract processFn: (data: T) => Promise<any>

  async execute(
    data: T
  ): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      const job = await this._queue.add(data)
      const result = await helpers.withTimeout(this.waitForCompletionMs, () =>
        job.finished()
      )

      return { success: true, result }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }
}
