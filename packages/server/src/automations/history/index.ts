import {
  AutomationLog,
  AutomationResults,
  AutomationStatus,
} from "../../definitions/automation"
import { getAppDB } from "@budibase/backend-core/context"
import {
  generateAutomationLogID,
  getAutomationLogParams,
  getQueryIndex,
  ViewNames,
} from "../../db/utils"
import { createLogByAutomationView } from "../../db/views/staticViews"
import { Automation } from "../../definitions/common"

const EARLIEST_DATE = new Date(0).toISOString()
const FREE_EXPIRY_SEC = 86400
const PRO_EXPIRY_SEC = FREE_EXPIRY_SEC * 30

function getStatus(results: AutomationResults) {
  let status = AutomationStatus.SUCCESS
  let first = true
  for (let step of results.steps) {
    // skip the trigger, its always successful if automation ran
    if (first) {
      first = false
      continue
    }
    if (!step.outputs?.success) {
      status = AutomationStatus.ERROR
    }
  }
  return status
}

// export function oneMonthAgo() {
//   return new Date(
//     new Date().getTime() - PRO_EXPIRY_SEC * 1000
//   ).toISOString()
// }

export function oneDayAgo() {
  return new Date(new Date().getTime() - FREE_EXPIRY_SEC * 1000).toISOString()
}

async function clearOldHistory() {
  const db = getAppDB()
  // TODO: handle license lookup for deletion
  const expiredEnd = oneDayAgo()
  const results = await getAllLogs(EARLIEST_DATE, expiredEnd, {
    include_docs: false,
  })
  const toDelete = results.map((doc: any) => ({
    _id: doc.id,
    _rev: doc.rev,
    _deleted: true,
  }))
  await db.bulkDocs(toDelete)
}

async function getAllLogs(
  startDate: string,
  endDate: string,
  opts: any = { include_docs: true }
) {
  const db = getAppDB()
  const queryParams: any = {
    endDate,
    startDate,
  }
  let response = (await db.allDocs(getAutomationLogParams(queryParams, opts)))
    .rows
  if (opts?.include_docs) {
    response = response.map((row: any) => row.doc)
  }
  return response
}

async function getLogsByAutomationID(
  automationId: string,
  opts: { startDate?: string; endDate?: string } = {}
): Promise<AutomationLog[]> {
  const db = getAppDB()
  try {
    const queryParams = {
      startDate: opts?.startDate,
      endDate: opts?.startDate,
      automationId,
    }
    return (
      await db.query(
        getQueryIndex(ViewNames.LOGS_BY_AUTOMATION),
        getAutomationLogParams(queryParams, { include_docs: true })
      )
    ).rows.map((row: any) => row.doc)
  } catch (err: any) {
    if (err != null && err.name === "not_found") {
      await createLogByAutomationView()
      return getLogsByAutomationID(automationId, opts)
    }
  }
  return []
}

export async function storeLog(
  automation: Automation,
  results: AutomationResults
) {
  const automationId = automation._id
  const name = automation.name
  const db = getAppDB()
  const isoDate = new Date().toISOString()
  const id = generateAutomationLogID(automationId, isoDate)

  await db.put({
    // results contain automationId and status for view
    ...results,
    automationId,
    automationName: name,
    status: getStatus(results),
    createdAt: isoDate,
    _id: id,
  })
  // clear up old history for app
  await clearOldHistory()
}

export async function getLogs(startDate: string, automationId?: string) {
  let logs: AutomationLog[]
  let endDate = new Date().toISOString()
  if (automationId) {
    logs = await getLogsByAutomationID(automationId, {
      startDate,
      endDate,
    })
  } else {
    logs = await getAllLogs(startDate, endDate)
  }
  return logs
}
