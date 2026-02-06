import { cache, context, db as dbUtils, logging } from "@budibase/backend-core"
import {
  Automation,
  AutomationLog,
  AutomationLogPage,
  AutomationResults,
  AutomationStatus,
  ConstantQuotaName,
  DatabaseQueryOpts,
  Workspace,
  WorkspaceMetadataErrors,
} from "@budibase/types"
import { backOff } from "../utilities/delay"
import { pagination } from "./utils/pagination"
import { getOldestRetentionDate } from "./utils/retention"
import { createLogByAutomationView } from "./utils/views"

const {
  SEPARATOR,
  UNICODE_MAX,
  DocumentType,
  AutomationViewMode,
  ViewName,
  getQueryIndex,
} = dbUtils

const EARLIEST_DATE = new Date(0).toISOString()
// set a maximum number that can be expired at once, control the speed of reads/writes
const EXPIRED_LIMIT = 100
const AUTOMATION_LOG_PAGE_SIZE = 10

export const oldestLogDate = async () => {
  return getOldestRetentionDate(ConstantQuotaName.AUTOMATION_LOG_RETENTION_DAYS)
}

function getAutomationLogParams(
  startDate: string,
  endDate: string,
  { status, automationId }: { status?: string; automationId?: string } = {},
  otherProps: Partial<DatabaseQueryOpts> = {}
) {
  const automationBase = automationId ? `${automationId}${SEPARATOR}` : ""
  const statusBase = status ? `${status}${SEPARATOR}` : ""
  let base
  if (status && automationId) {
    base = `${AutomationViewMode.ALL}${SEPARATOR}${statusBase}${automationBase}`
  } else if (status) {
    base = `${AutomationViewMode.STATUS}${SEPARATOR}${statusBase}`
  } else if (automationId) {
    base = `${AutomationViewMode.AUTOMATION}${SEPARATOR}${automationBase}`
  } else {
    base = `${DocumentType.AUTOMATION_LOG}${SEPARATOR}`
  }
  return {
    ...otherProps,
    descending: true,
    startkey: `${base}${endDate}${UNICODE_MAX}`,
    endkey: `${base}${startDate}`,
  }
}

export function generateAutomationLogID(
  isoDate: string,
  status: string,
  automationId: string
) {
  return `${DocumentType.AUTOMATION_LOG}${SEPARATOR}${isoDate}${SEPARATOR}${automationId}${SEPARATOR}${status}`
}

export async function getAllLogs(
  startDate: string,
  endDate: string,
  opts: {
    docs: boolean
    status?: string
    paginate?: boolean
    page?: string
    limit?: number
  } = { docs: true }
): Promise<AutomationLogPage> {
  let db = context.getProdWorkspaceDB()
  if (!(await db.exists())) {
    db = context.getDevWorkspaceDB()
  }
  const optional: any = { status: opts.status }
  const limit = opts?.limit
    ? opts.limit
    : opts?.paginate
      ? AUTOMATION_LOG_PAGE_SIZE + 1
      : undefined
  const params = getAutomationLogParams(startDate, endDate, optional, {
    include_docs: opts.docs,
    limit,
  })
  if (opts?.page) {
    params.startkey = opts.page
  }
  const response = await db.allDocs<AutomationLog>(params)
  const paginatedResponse = pagination(response, {
    paginate: opts?.paginate,
    pageSize: AUTOMATION_LOG_PAGE_SIZE,
  })
  return {
    ...paginatedResponse,
    totalLogs: paginatedResponse.totalRows,
  }
}

export async function getLogsByView(
  startDate: string,
  endDate: string,
  viewParams: { automationId?: string; status?: string; page?: string } = {}
): Promise<AutomationLogPage> {
  let db = context.getProdWorkspaceDB()
  if (!(await db.exists())) {
    db = context.getDevWorkspaceDB()
  }
  let response
  try {
    const optional = {
      automationId: viewParams?.automationId,
      status: viewParams?.status,
    }
    const params = getAutomationLogParams(startDate, endDate, optional, {
      include_docs: true,
      limit: AUTOMATION_LOG_PAGE_SIZE + 1,
    })
    if (viewParams?.page) {
      params.startkey = viewParams.page
    }
    response = await db.query<AutomationLog>(
      getQueryIndex(ViewName.AUTOMATION_LOGS),
      params
    )
  } catch (err: any) {
    if (
      err != null &&
      (err.name === "not_found" || err.error === "not_found")
    ) {
      await createLogByAutomationView()
      return getLogsByView(startDate, endDate, viewParams)
    } else {
      throw err
    }
  }
  const paginatedResponse = pagination(response, {
    paginate: true,
    pageSize: AUTOMATION_LOG_PAGE_SIZE,
  })
  return {
    ...paginatedResponse,
    totalLogs: paginatedResponse.totalRows / 3, // The automation_logs view emits three times, which triples the count, i.e. emit(statusKey), emit(autoKey), emit(allKey)
  }
}

export async function writeLog(
  automation: Automation,
  results: AutomationResults
) {
  const db = context.getProdWorkspaceDB()
  const automationId = automation._id as string
  const name = automation.name
  const isoDate = new Date().toISOString()
  const id = generateAutomationLogID(isoDate, results.status, automationId)
  const log: AutomationLog = {
    // results contain automationId and status for view
    ...results,
    automationId,
    status: results.status,
    automationName: name,
    createdAt: isoDate,
    _id: id,
  }
  await db.put(log)
  return id
}

export async function updateAppMetadataWithErrors(
  logIds: string[],
  { clearing } = { clearing: false }
) {
  const db = context.getProdWorkspaceDB()
  // this will try multiple times with a delay between to update the metadata
  await backOff(async () => {
    const metadata = await db.get<Workspace>(
      dbUtils.DocumentType.WORKSPACE_METADATA
    )
    for (let logId of logIds) {
      const parts = logId.split(dbUtils.SEPARATOR)
      const autoId = `${parts[parts.length - 3]}${dbUtils.SEPARATOR}${
        parts[parts.length - 2]
      }`
      let errors: WorkspaceMetadataErrors = {}
      if (metadata.automationErrors) {
        errors = metadata.automationErrors as WorkspaceMetadataErrors
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
    await cache.workspace.invalidateWorkspaceMetadata(metadata.appId, metadata)
  }, "Failed to update app metadata with automation log error")
}

export async function getExpiredLogs(): Promise<AutomationLogPage> {
  const expiredEnd = await oldestLogDate()

  try {
    return await getAllLogs(EARLIEST_DATE, expiredEnd, {
      docs: false,
      paginate: false,
      limit: EXPIRED_LIMIT,
    })
  } catch (err) {
    return { data: [], hasNextPage: false, totalLogs: 0 }
  }
}

export async function clearOldHistory() {
  const db = context.getProdWorkspaceDB()
  try {
    const expired = await getExpiredLogs()
    if (!expired.data || expired.data.length === 0) {
      return
    }
    const toDelete = expired.data.map((doc: any) => ({
      _id: doc.id,
      _rev: doc.value.rev,
      _deleted: true,
    }))
    const errorLogIds = expired.data
      .filter((doc: any) => {
        const parts = doc.id.split(dbUtils.SEPARATOR)
        const status = parts[parts.length - 1]
        return status === AutomationStatus.ERROR
      })
      .map((doc: any) => doc.id)
    await db.bulkDocs(toDelete)
    if (errorLogIds.length) {
      await updateAppMetadataWithErrors(errorLogIds, { clearing: true })
    }
  } catch (err) {
    logging.logAlert(
      `Failed to cleanup automation log history - Database "${db.name}"`,
      err
    )
  }
}
