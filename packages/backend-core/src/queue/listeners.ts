import { Job, JobId, Queue } from "bull"
import { JobQueue } from "./constants"
import * as context from "../context"

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

function getLogParams(
  eventType: QueueEventType,
  event: BullEvent,
  opts: {
    job?: Job
    jobId?: JobId
    error?: Error
  } = {},
  extra: any = {}
) {
  const message = `[BULL] ${eventType}=${event}`
  const err = opts.error

  const bullLog = {
    _logKey: "bull",
    eventType,
    event,
    job: opts.job,
    jobId: opts.jobId || opts.job?.id,
    ...extra,
  }

  let automationLog
  if (opts.job?.data?.automation) {
    automationLog = {
      _logKey: "automation",
      trigger: opts.job
        ? opts.job.data.automation.definition.trigger.event
        : undefined,
    }
  }

  return [message, err, bullLog, automationLog]
}

enum BullEvent {
  ERROR = "error",
  WAITING = "waiting",
  ACTIVE = "active",
  STALLED = "stalled",
  PROGRESS = "progress",
  COMPLETED = "completed",
  FAILED = "failed",
  PAUSED = "paused",
  RESUMED = "resumed",
  CLEANED = "cleaned",
  DRAINED = "drained",
  REMOVED = "removed",
}

enum QueueEventType {
  AUTOMATION_EVENT = "automation-event",
  APP_BACKUP_EVENT = "app-backup-event",
  AUDIT_LOG_EVENT = "audit-log-event",
  SYSTEM_EVENT = "system-event",
}

const EventTypeMap: { [key in JobQueue]: QueueEventType } = {
  [JobQueue.AUTOMATION]: QueueEventType.AUTOMATION_EVENT,
  [JobQueue.APP_BACKUP]: QueueEventType.APP_BACKUP_EVENT,
  [JobQueue.AUDIT_LOG]: QueueEventType.AUDIT_LOG_EVENT,
  [JobQueue.SYSTEM_EVENT_QUEUE]: QueueEventType.SYSTEM_EVENT,
}

function logging(queue: Queue, jobQueue: JobQueue) {
  const eventType = EventTypeMap[jobQueue]

  function doInJobContext(job: Job, task: any) {
    // if this is an automation job try to get the app id
    const appId = job.data.event?.appId
    if (appId) {
      return context.doInContext(appId, task)
    } else {
      task()
    }
  }

  queue
    .on(BullEvent.STALLED, async (job: Job) => {
      // A job has been marked as stalled. This is useful for debugging job
      // workers that crash or pause the event loop.
      await doInJobContext(job, () => {
        console.error(...getLogParams(eventType, BullEvent.STALLED, { job }))
      })
    })
    .on(BullEvent.ERROR, (error: any) => {
      // An error occurred.
      console.error(...getLogParams(eventType, BullEvent.ERROR, { error }))
    })

  if (process.env.NODE_DEBUG?.includes("bull")) {
    queue
      .on(BullEvent.WAITING, (jobId: JobId) => {
        // A Job is waiting to be processed as soon as a worker is idling.
        console.info(...getLogParams(eventType, BullEvent.WAITING, { jobId }))
      })
      .on(BullEvent.ACTIVE, async (job: Job, jobPromise: any) => {
        // A job has started. You can use `jobPromise.cancel()`` to abort it.
        await doInJobContext(job, () => {
          console.info(...getLogParams(eventType, BullEvent.ACTIVE, { job }))
        })
      })
      .on(BullEvent.PROGRESS, async (job: Job, progress: any) => {
        // A job's progress was updated
        await doInJobContext(job, () => {
          console.info(
            ...getLogParams(
              eventType,
              BullEvent.PROGRESS,
              { job },
              { progress }
            )
          )
        })
      })
      .on(BullEvent.COMPLETED, async (job: Job, result) => {
        // A job successfully completed with a `result`.
        await doInJobContext(job, () => {
          console.info(
            ...getLogParams(eventType, BullEvent.COMPLETED, { job }, { result })
          )
        })
      })
      .on(BullEvent.FAILED, async (job: Job, error: any) => {
        // A job failed with reason `err`!
        await doInJobContext(job, () => {
          console.error(
            ...getLogParams(eventType, BullEvent.FAILED, { job, error })
          )
        })
      })
      .on(BullEvent.PAUSED, () => {
        // The queue has been paused.
        console.info(...getLogParams(eventType, BullEvent.PAUSED))
      })
      .on(BullEvent.RESUMED, () => {
        // The queue has been resumed.
        console.info(...getLogParams(eventType, BullEvent.RESUMED))
      })
      .on(BullEvent.CLEANED, (jobs: Job[], type: string) => {
        // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
        // jobs, and `type` is the type of jobs cleaned.
        console.info(
          ...getLogParams(
            eventType,
            BullEvent.CLEANED,
            {},
            { length: jobs.length, type }
          )
        )
      })
      .on(BullEvent.DRAINED, () => {
        // Emitted every time the queue has processed all the waiting jobs (even if there can be some delayed jobs not yet processed)
        console.info(...getLogParams(eventType, BullEvent.DRAINED))
      })
      .on(BullEvent.REMOVED, (job: Job) => {
        // A job successfully removed.
        console.info(...getLogParams(eventType, BullEvent.REMOVED, { job }))
      })
  }
}
