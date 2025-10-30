import { context, logging, queue } from "@budibase/backend-core"
import { Job } from "bull"
import env from "../../../environment"
import sdk from "../../../sdk"
import { updateAllFormulasInTable } from "../row/staticFormula"

const MAX_ATTEMPTS = 3
const CONCURRENCY = 1

export type StaticFormulaSyncJob = {
  workspaceId: string
  tableIds: string[]
}

const staticFormulaQueue = new queue.BudibaseQueue<StaticFormulaSyncJob>(
  queue.JobQueue.STATIC_FORMULA_SYNC,
  {
    jobOptions: {
      attempts: MAX_ATTEMPTS,
      removeOnComplete: true,
      removeOnFail: true,
    },
    maxStalledCount: MAX_ATTEMPTS,
    removeStalledCb: async (job: Job) => {
      logging.logAlert(
        `Static formula sync job stalled. jobId="${job.id}" reason="${job.failedReason}"`
      )
    },
  }
)

async function runStaticFormulaSync(data: StaticFormulaSyncJob) {
  const { workspaceId } = data
  const tableIds = Array.from(new Set(data.tableIds)).filter(
    (tableId): tableId is string => Boolean(tableId)
  )

  if (tableIds.length === 0) {
    return
  }

  await context.doInWorkspaceContext(workspaceId, async () => {
    for (const tableId of tableIds) {
      try {
        const table = await sdk.tables.getTable(tableId)
        if (!table?._id) {
          continue
        }
        await updateAllFormulasInTable(table)
      } catch (err: any) {
        logging.logAlert(
          `Failed to update static formulas for table "${tableId}" in workspace "${workspaceId}"`,
          err
        )
      }
    }
  })
}

async function processJob(job: Job<StaticFormulaSyncJob>) {
  await runStaticFormulaSync(job.data)
}

export function initStaticFormulaQueue() {
  if (env.isTest()) {
    return
  }

  return staticFormulaQueue.process(CONCURRENCY, processJob)
}

export async function enqueueStaticFormulaSyncJob(data: StaticFormulaSyncJob) {
  const deduped = {
    workspaceId: data.workspaceId,
    tableIds: Array.from(new Set(data.tableIds)).filter(
      (tableId): tableId is string => Boolean(tableId)
    ),
  }

  if (deduped.tableIds.length === 0) {
    return
  }

  if (env.isTest()) {
    await runStaticFormulaSync(deduped)
    return
  }

  await staticFormulaQueue.add(deduped)
}
