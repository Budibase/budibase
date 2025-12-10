import { context, db as dbCore, queue } from "@budibase/backend-core"
import { DocumentType } from "@budibase/types"
import type { Automation, AutomationData } from "@budibase/types"
import type { JobInformation } from "bull"

const JOB_ID_MARKERS = ["_cron_", "_email_"]

type RepeatableJob = Pick<JobInformation, "id" | "key">

export interface CronJanitorDeps {
  listRepeatableJobs: () => Promise<RepeatableJob[]>
  removeRepeatableJob: (job: RepeatableJob) => Promise<void>
  workspaceExists: (workspaceId: string) => Promise<boolean>
  fetchWorkspaceJobIds: (workspaceId: string) => Promise<Set<string>>
}

let automationQueue: queue.BudibaseQueue<AutomationData> | null = null

function getAutomationQueue() {
  if (!automationQueue) {
    automationQueue = new queue.BudibaseQueue<AutomationData>(
      queue.JobQueue.AUTOMATION
    )
  }
  return automationQueue
}

function extractJobId(job: RepeatableJob) {
  if (job.id) {
    return job.id
  }
  const segments = job.key?.split(":")
  if (segments?.length >= 2 && segments[1]) {
    return segments[1]
  }
  return undefined
}

function extractWorkspaceId(jobId: string) {
  for (const marker of JOB_ID_MARKERS) {
    const idx = jobId.indexOf(marker)
    if (idx !== -1) {
      return jobId.slice(0, idx)
    }
  }
  return undefined
}

async function fetchWorkspaceAutomationJobIds(workspaceId: string) {
  const startkey = `${DocumentType.AUTOMATION}${dbCore.SEPARATOR}`
  const endkey = `${startkey}${dbCore.UNICODE_MAX}`

  return await context.doInWorkspaceContext(workspaceId, async () => {
    const db = context.getWorkspaceDB()
    const response = await db.allDocs<Automation>({
      startkey,
      endkey,
      include_docs: true,
    })

    const jobIds = new Set<string>()
    for (const row of response.rows) {
      const automation = row.doc
      if (!automation || automation._deleted) {
        continue
      }
      const cronJobId = automation.definition?.trigger?.cronJobId
      if (cronJobId) {
        jobIds.add(cronJobId)
      }
    }
    return jobIds
  })
}

function getDefaultDeps(): CronJanitorDeps {
  return {
    listRepeatableJobs: async () => {
      const queueInstance = getAutomationQueue().getBullQueue()
      return queueInstance.getRepeatableJobs()
    },
    removeRepeatableJob: async job => {
      const queueInstance = getAutomationQueue().getBullQueue()
      await queueInstance.removeRepeatableByKey(job.key)
      if (job.id) {
        await queueInstance.removeJobs(job.id)
      }
    },
    workspaceExists: workspaceId => dbCore.dbExists(workspaceId),
    fetchWorkspaceJobIds: workspaceId =>
      fetchWorkspaceAutomationJobIds(workspaceId),
  }
}

export async function runAutomationCronJanitor(
  deps: CronJanitorDeps = getDefaultDeps()
) {
  try {
    const jobs = await deps.listRepeatableJobs()
    if (!jobs.length) {
      return 0
    }

    const groupedJobs = new Map<
      string,
      { job: RepeatableJob; jobId: string }[]
    >()

    for (const job of jobs) {
      const jobId = extractJobId(job)
      if (!jobId) {
        console.warn(
          `[cron-janitor] Skipping repeatable job without job id (${job.key})`
        )
        continue
      }
      const workspaceId = extractWorkspaceId(jobId)
      if (!workspaceId) {
        console.warn(
          `[cron-janitor] Skipping repeatable job with unexpected id ${jobId}`
        )
        continue
      }
      const list = groupedJobs.get(workspaceId) || []
      list.push({ job, jobId })
      groupedJobs.set(workspaceId, list)
    }

    let removedCount = 0

    for (const [workspaceId, workspaceJobs] of groupedJobs.entries()) {
      let workspaceExists = false
      try {
        workspaceExists = await deps.workspaceExists(workspaceId)
      } catch (err) {
        continue
      }

      if (!workspaceExists) {
        for (const { job } of workspaceJobs) {
          try {
            await deps.removeRepeatableJob(job)
            removedCount++
            console.warn(
              `[cron-janitor] Removed job ${job.key} because workspace ${workspaceId} is missing`
            )
          } catch (err) {
            console.error(
              `[cron-janitor] Failed to remove job ${job.key} for missing workspace ${workspaceId}`,
              err
            )
          }
        }
        continue
      }

      let validJobIds: Set<string>
      try {
        validJobIds = await deps.fetchWorkspaceJobIds(workspaceId)
      } catch (err) {
        console.error(
          `[cron-janitor] Failed to load automations for ${workspaceId}`,
          err
        )
        continue
      }

      for (const { job, jobId } of workspaceJobs) {
        if (!validJobIds.has(jobId)) {
          try {
            await deps.removeRepeatableJob(job)
            removedCount++
            console.warn(
              `[cron-janitor] Removed job ${jobId} from workspace ${workspaceId} because no automation references it`
            )
          } catch (err) {
            console.error(
              `[cron-janitor] Failed to remove job ${jobId} from workspace ${workspaceId}`,
              err
            )
          }
        }
      }
    }

    if (removedCount > 0) {
      console.log(
        `[cron-janitor] Removed ${removedCount} orphaned automation jobs`
      )
    }
    return removedCount
  } catch (err) {
    console.error(
      "[cron-janitor] Failed to inspect repeatable automations",
      err
    )
    return 0
  }
}
