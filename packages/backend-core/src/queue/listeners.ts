import { Job, JobId, Queue } from "bull"
import { JobQueue } from "./constants"

export type StalledFn = (job: Job) => Promise<void>

export function addListeners(
  queue: Queue,
  jobQueue: JobQueue,
  removeStalledCb?: StalledFn
) {
  logging(queue, jobQueue)
  if (removeStalledCb) {
    handleStalled(queue, removeStalledCb)
  }
}

function handleStalled(queue: Queue, removeStalledCb?: StalledFn) {
  queue.on("stalled", async (job: Job) => {
    if (removeStalledCb) {
      await removeStalledCb(job)
    } else if (job.opts.repeat) {
      const jobId = job.id
      const repeatJobs = await queue.getRepeatableJobs()
      for (let repeatJob of repeatJobs) {
        if (repeatJob.id === jobId) {
          await queue.removeRepeatableByKey(repeatJob.key)
        }
      }
      console.log(`jobId=${jobId} disabled`)
    }
  })
}

function logging(queue: Queue, jobQueue: JobQueue) {
  let eventType: string
  switch (jobQueue) {
    case JobQueue.AUTOMATION:
      eventType = "automation-event"
      break
    case JobQueue.APP_BACKUP:
      eventType = "app-backup-event"
      break
  }
  if (process.env.NODE_DEBUG?.includes("bull")) {
    queue
      .on("error", (error: any) => {
        // An error occurred.
        console.error(`${eventType}=error error=${JSON.stringify(error)}`)
      })
      .on("waiting", (jobId: JobId) => {
        // A Job is waiting to be processed as soon as a worker is idling.
        console.log(`${eventType}=waiting jobId=${jobId}`)
      })
      .on("active", (job: Job, jobPromise: any) => {
        // A job has started. You can use `jobPromise.cancel()`` to abort it.
        console.log(`${eventType}=active jobId=${job.id}`)
      })
      .on("stalled", (job: Job) => {
        // A job has been marked as stalled. This is useful for debugging job
        // workers that crash or pause the event loop.
        console.error(
          `${eventType}=stalled jobId=${job.id} job=${JSON.stringify(job)}`
        )
      })
      .on("progress", (job: Job, progress: any) => {
        // A job's progress was updated!
        console.log(
          `${eventType}=progress jobId=${job.id} progress=${progress}`
        )
      })
      .on("completed", (job: Job, result) => {
        // A job successfully completed with a `result`.
        console.log(`${eventType}=completed jobId=${job.id} result=${result}`)
      })
      .on("failed", (job, err: any) => {
        // A job failed with reason `err`!
        console.log(`${eventType}=failed jobId=${job.id} error=${err}`)
      })
      .on("paused", () => {
        // The queue has been paused.
        console.log(`${eventType}=paused`)
      })
      .on("resumed", (job: Job) => {
        // The queue has been resumed.
        console.log(`${eventType}=paused jobId=${job.id}`)
      })
      .on("cleaned", (jobs: Job[], type: string) => {
        // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
        // jobs, and `type` is the type of jobs cleaned.
        console.log(`${eventType}=cleaned length=${jobs.length} type=${type}`)
      })
      .on("drained", () => {
        // Emitted every time the queue has processed all the waiting jobs (even if there can be some delayed jobs not yet processed)
        console.log(`${eventType}=drained`)
      })
      .on("removed", (job: Job) => {
        // A job successfully removed.
        console.log(`${eventType}=removed jobId=${job.id}`)
      })
  }
}
