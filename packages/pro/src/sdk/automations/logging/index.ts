import { context, db as dbUtils } from "@budibase/backend-core"
import {
  Automation,
  AutomationLog,
  AutomationLogPage,
  AutomationResults,
  AutomationStatus,
} from "@budibase/types"
import {
  oldestLogDate as _oldestLogDate,
  clearOldHistory,
  getAllLogs,
  getLogsByView,
  updateAppMetadataWithErrors,
  writeLog,
} from "../../../db/automations"

export const oldestLogDate = _oldestLogDate

export interface LogSearchOptions {
  startDate?: string
  status?: AutomationStatus
  statuses?: AutomationStatus[]
  automationId?: string
  page?: string
  durationGte?: number
  durationLte?: number
  attemptGte?: number
  attemptLte?: number
}

interface FilterOptions {
  statuses?: AutomationStatus[]
  durationGte?: number
  durationLte?: number
  attemptGte?: number
  attemptLte?: number
}

function matchesFilters(log: AutomationLog, filters: FilterOptions): boolean {
  if (filters.statuses && filters.statuses.length > 0) {
    if (!filters.statuses.includes(log.status)) {
      return false
    }
  }

  if (filters.durationGte !== undefined) {
    if (log.durationMs === undefined || log.durationMs < filters.durationGte) {
      return false
    }
  }
  if (filters.durationLte !== undefined) {
    if (log.durationMs === undefined || log.durationMs > filters.durationLte) {
      return false
    }
  }

  if (filters.attemptGte !== undefined) {
    if (log.attempt === undefined || log.attempt < filters.attemptGte) {
      return false
    }
  }
  if (filters.attemptLte !== undefined) {
    if (log.attempt === undefined || log.attempt > filters.attemptLte) {
      return false
    }
  }

  return true
}

function applyFilters(
  response: AutomationLogPage,
  filters: FilterOptions
): AutomationLogPage {
  const hasFilters =
    (filters.statuses && filters.statuses.length > 0) ||
    filters.durationGte !== undefined ||
    filters.durationLte !== undefined ||
    filters.attemptGte !== undefined ||
    filters.attemptLte !== undefined

  if (!hasFilters) {
    return response
  }

  const filteredData = response.data.filter(log => matchesFilters(log, filters))

  return {
    ...response,
    data: filteredData,
    totalLogs: filteredData.length,
  }
}

async function getLogs(
  startDate?: string,
  status?: string,
  automationId?: string,
  page?: string
): Promise<AutomationLogPage> {
  let response: AutomationLogPage
  let endDate = new Date().toISOString()
  const maxStartDate = await oldestLogDate()
  if (!startDate || startDate < maxStartDate) {
    startDate = maxStartDate
  }
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

export async function logSearch(options: LogSearchOptions) {
  await clearOldHistory()

  let status = options.status
  const filters: FilterOptions = {}

  if (options.statuses && options.statuses.length > 0) {
    if (options.statuses.length === 1) {
      status = options.statuses[0]
    } else {
      filters.statuses = options.statuses
    }
  }

  if (options.durationGte !== undefined) {
    filters.durationGte = options.durationGte
  }
  if (options.durationLte !== undefined) {
    filters.durationLte = options.durationLte
  }
  if (options.attemptGte !== undefined) {
    filters.attemptGte = options.attemptGte
  }
  if (options.attemptLte !== undefined) {
    filters.attemptLte = options.attemptLte
  }

  const response = await getLogs(
    options.startDate,
    status,
    options.automationId,
    options.page
  )

  return applyFilters(response, filters)
}

export async function storeLog(
  automation: Automation,
  results: AutomationResults
) {
  // can disable this if un-needed in self-host, also only do this for prod apps
  if (!dbUtils.isProdWorkspaceID(context.getWorkspaceId())) {
    return
  }
  const id = await writeLog(automation, results)
  // need to note on the app metadata that there is an error, store what the error is
  if (results.status === AutomationStatus.ERROR) {
    await updateAppMetadataWithErrors([id])
  }
  // clear up old logging for app
  await clearOldHistory()
}
