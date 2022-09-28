import { Queue, Job, JobId } from "bull"
import { AutomationEvent } from "../definitions/automations"
import * as automation from "../threads/automation"

export const addListeners = (queue: Queue) => {
  logging(queue)
  handleStalled(queue)
}

const handleStalled = (queue: Queue) => {
  queue.on("stalled", async (job: Job) => {
    await automation.removeStalled(job as AutomationEvent)
  })
}

const logging = (queue: Queue) => {
  if (process.env.NODE_DEBUG?.includes("bull")) {
    queue
      .on("error", (error: any) => {
        // An error occurred.
        console.error(`automation-event=error error=${JSON.stringify(error)}`)
      })
      .on("waiting", (jobId: JobId) => {
        // A Job is waiting to be processed as soon as a worker is idling.
        console.log(`automation-event=waiting jobId=${jobId}`)
      })
      .on("active", (job: Job, jobPromise: any) => {
        // A job has started. You can use `jobPromise.cancel()`` to abort it.
        console.log(`automation-event=active jobId=${job.id}`)
      })
      .on("stalled", (job: Job) => {
        // A job has been marked as stalled. This is useful for debugging job
        // workers that crash or pause the event loop.
        console.error(
          `automation-event=stalled jobId=${job.id} job=${JSON.stringify(job)}`
        )
      })
      .on("progress", (job: Job, progress: any) => {
        // A job's progress was updated!
        console.log(
          `automation-event=progress jobId=${job.id} progress=${progress}`
        )
      })
      .on("completed", (job: Job, result) => {
        // A job successfully completed with a `result`.
        console.log(
          `automation-event=completed jobId=${job.id} result=${result}`
        )
      })
      .on("failed", (job, err: any) => {
        // A job failed with reason `err`!
        console.log(`automation-event=failed jobId=${job.id} error=${err}`)
      })
      .on("paused", () => {
        // The queue has been paused.
        console.log(`automation-event=paused`)
      })
      .on("resumed", (job: Job) => {
        // The queue has been resumed.
        console.log(`automation-event=paused jobId=${job.id}`)
      })
      .on("cleaned", (jobs: Job[], type: string) => {
        // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
        // jobs, and `type` is the type of jobs cleaned.
        console.log(
          `automation-event=cleaned length=${jobs.length} type=${type}`
        )
      })
      .on("drained", () => {
        // Emitted every time the queue has processed all the waiting jobs (even if there can be some delayed jobs not yet processed)
        console.log(`automation-event=drained`)
      })
      .on("removed", (job: Job) => {
        // A job successfully removed.
        console.log(`automation-event=removed jobId=${job.id}`)
      })
  }
}
