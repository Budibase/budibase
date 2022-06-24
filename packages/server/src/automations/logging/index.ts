import {
  AutomationLogPage,
  AutomationResults,
  AutomationStatus,
} from "../../definitions/automation"
import { getAppId, getProdAppDB } from "@budibase/backend-core/context"
import {
  DocumentTypes,
  generateAutomationLogID,
  getAutomationLogParams,
  getQueryIndex,
  ViewNames,
  SEPARATOR,
  isProdAppID,
} from "../../db/utils"
import { createLogByAutomationView } from "../../db/views/staticViews"
import { Automation, MetadataErrors } from "../../definitions/common"
import { app } from "@budibase/backend-core/cache"
import { backOff } from "../../utilities"
import * as env from "../../environment"

const PAGE_SIZE = 9
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

export function oneMonthAgo() {
  return new Date(new Date().getTime() - PRO_EXPIRY_SEC * 1000).toISOString()
}

export function oneDayAgo() {
  return new Date(new Date().getTime() - FREE_EXPIRY_SEC * 1000).toISOString()
}

async function clearOldHistory() {
  const db = getProdAppDB()
  // TODO: handle license lookup for deletion
  const expiredEnd = oneDayAgo()
  const results = await getAllLogs(EARLIEST_DATE, expiredEnd, {
    docs: false,
    paginate: false,
  })
  const toDelete = results.data.map((doc: any) => ({
    _id: doc.id,
    _rev: doc.value.rev,
    _deleted: true,
  }))
  const errorLogIds = results.data
    .filter((doc: any) => {
      const parts = doc.id.split(SEPARATOR)
      const status = parts[parts.length - 1]
      return status === AutomationStatus.ERROR
    })
    .map((doc: any) => doc.id)
  await db.bulkDocs(toDelete)
  if (errorLogIds.length) {
    await updateAppMetadataWithErrors(errorLogIds, { clearing: true })
  }
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
  const db = getProdAppDB()
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
  const db = getProdAppDB()
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

async function updateAppMetadataWithErrors(
  logIds: string[],
  { clearing } = { clearing: false }
) {
  const db = getProdAppDB()
  // this will try multiple times with a delay between to update the metadata
  await backOff(async () => {
    const metadata = await db.get(DocumentTypes.APP_METADATA)
    for (let logId of logIds) {
      const parts = logId.split(SEPARATOR)
      const autoId = `${parts[parts.length - 3]}${SEPARATOR}${
        parts[parts.length - 2]
      }`
      let errors: MetadataErrors = {}
      if (metadata.automationErrors) {
        errors = metadata.automationErrors as MetadataErrors
      }
      if (!Array.isArray(errors[autoId])) {
        errors[autoId] = []
      }
      const idx = errors[autoId].indexOf(logId)
      if (clearing && idx !== -1) {
        errors[autoId].splice(idx, 1)
      } else {
        errors[autoId].push(logId)
      }
      // if clearing and reach zero, this will pass and will remove the element
      if (errors[autoId].length === 0) {
        delete errors[autoId]
      }
      metadata.automationErrors = errors
    }
    await db.put(metadata)
    // don't update cache until after DB put, make sure it has been stored successfully
    await app.invalidateAppMetadata(metadata.appId, metadata)
  }, "Failed to update app metadata with automation log error")
}

export async function storeLog(
  automation: Automation,
  results: AutomationResults
) {
  // can disable this if un-needed in self-host, also only do this for prod apps
  if (env.DISABLE_AUTOMATION_LOGS || !isProdAppID(getAppId())) {
    return
  }
  const db = getProdAppDB()
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

  // need to note on the app metadata that there is an error, store what the error is
  if (status === AutomationStatus.ERROR) {
    await updateAppMetadataWithErrors([id])
  }

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
