import { context, db as dbUtils } from "@budibase/backend-core"
import {
  Automation,
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

async function getLogs(
  startDate?: string,
  status?: string,
  automationId?: string,
  page?: string
): Promise<AutomationLogPage> {
  let response: AutomationLogPage
  let endDate = new Date().toISOString()
  const maxStartDate = await oldestLogDate()
  // check that the start date does not exceed license
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

export interface LogSearchOptions {
  startDate?: string
  status?: AutomationStatus
  automationId?: string
  page?: string
}

export async function logSearch(options: LogSearchOptions) {
  // before querying logs, make sure old logs are cleared out
  await clearOldHistory()
  return await getLogs(
    options.startDate,
    options.status,
    options.automationId,
    options.page
  )
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
