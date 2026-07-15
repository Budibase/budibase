import type { Job } from "bull"

export const QUEUE_JOB_CANCELLATION_PROGRESS =
  "budibase_queue_job_cancellation_requested"

export class QueueJobCancelledError extends Error {
  constructor(message = "Queue job cancelled") {
    super(message)
    this.name = "QueueJobCancelledError"
  }
}

export const isQueueJobCancelledError = (
  error: unknown
): error is QueueJobCancelledError =>
  error instanceof Error && error.name === "QueueJobCancelledError"

export const requestActiveJobCancellation = async <T>(job: Job<T>) => {
  await job.progress(QUEUE_JOB_CANCELLATION_PROGRESS)
}

export const removeOrCancelJob = async <T>(
  job: Job<T>,
  waitForActive = false
) => {
  try {
    await job.remove()
    return
  } catch {
    try {
      await requestActiveJobCancellation(job)
    } catch {
      return
    }
  }

  if (waitForActive) {
    await job.finished().catch(() => undefined)
  }
}

export const registerActiveJobController = <T>(
  job: Job<T>,
  controllers: Map<string, AbortController>
) => {
  const jobId = String(job.id)
  const controller = new AbortController()
  controllers.set(jobId, controller)
  if (job.progress() === QUEUE_JOB_CANCELLATION_PROGRESS) {
    controller.abort(new QueueJobCancelledError())
  }
  return controller
}
