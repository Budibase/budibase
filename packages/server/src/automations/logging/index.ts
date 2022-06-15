import {
  AutomationLog,
  AutomationLogPage,
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
import * as env from "../../environment"

const PAGE_SIZE = 9
const EARLIEST_DATE = new Date(0).toISOString()
const FREE_EXPIRY_SEC = 86400
// const PRO_EXPIRY_SEC = FREE_EXPIRY_SEC * 30

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
    docs: false,
  })
  const toDelete = results.data.map((doc: any) => ({
    _id: doc.id,
    _rev: doc.rev,
    _deleted: true,
  }))
  await db.bulkDocs(toDelete)
}

function pagination(
  response: any,
  paginate: boolean = true
): AutomationLogPage {
  const data = response.rows.map((row: any) => {
    return row.doc ? row.doc : row
  })
  if (!paginate) {
    return { data, hasNextPage: false }
  }
  const hasNextPage = data.length > PAGE_SIZE
  return {
    data: data.slice(0, PAGE_SIZE),
    hasNextPage,
    nextPage: hasNextPage ? data[PAGE_SIZE]?._id : undefined,
  }
}

async function getAllLogs(
  startDate: string,
  endDate: string,
  opts: {
    docs: boolean
    status?: string
    paginate?: boolean
    page?: string
  } = { docs: true }
): Promise<AutomationLogPage> {
  const db = getAppDB()
  let optional: any = { status: opts.status }
  const params = getAutomationLogParams(startDate, endDate, optional, {
    include_docs: opts.docs,
    limit: opts?.paginate ? PAGE_SIZE + 1 : undefined,
  })
  if (opts?.page) {
    params.startkey = opts.page
  }
  let response = await db.allDocs(params)
  return pagination(response, opts?.paginate)
}

async function getLogsByView(
  startDate: string,
  endDate: string,
  viewParams: { automationId?: string; status?: string; page?: string } = {}
): Promise<AutomationLogPage> {
  const db = getAppDB()
  let response
  try {
    let optional = {
      automationId: viewParams?.automationId,
      status: viewParams?.status,
    }
    const params = getAutomationLogParams(startDate, endDate, optional, {
      include_docs: true,
      limit: PAGE_SIZE,
    })
    if (viewParams?.page) {
      params.startkey = viewParams.page
    }
    response = await db.query(getQueryIndex(ViewNames.AUTO_LOGS), params)
  } catch (err: any) {
    if (err != null && err.name === "not_found") {
      await createLogByAutomationView()
      return getLogsByView(startDate, endDate, viewParams)
    }
  }
  return pagination(response)
}

export async function storeLog(
  automation: Automation,
  results: AutomationResults
) {
  // can disable this if un-needed in self host
  if (env.DISABLE_AUTOMATION_LOGS) {
    return
  }
  const db = getAppDB()
  const automationId = automation._id
  const name = automation.name
  const status = getStatus(results)
  const isoDate = new Date().toISOString()
  const id = generateAutomationLogID(isoDate, status, automationId)

  await db.put({
    // results contain automationId and status for view
    ...results,
    automationId,
    status,
    automationName: name,
    createdAt: isoDate,
    _id: id,
  })
  // clear up old logging for app
  await clearOldHistory()
}

export async function getLogs(
  startDate: string,
  status?: string,
  automationId?: string,
  page?: string
): Promise<AutomationLogPage> {
  let response: AutomationLogPage
  let endDate = new Date().toISOString()
  if (automationId || status) {
    response = await getLogsByView(startDate, endDate, {
      automationId,
      status,
      page,
    })
  } else {
    response = await getAllLogs(startDate, endDate, {
      status,
      page,
      docs: true,
      paginate: true,
    })
  }
  return response
}
