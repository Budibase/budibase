import { db as dbUtils, logging } from "@budibase/backend-core"
import { automations } from "@budibase/pro"
import { Automation, AutomationResults, Workspace } from "@budibase/types"
import sizeof from "object-sizeof"
import env from "../../environment"

const MB_IN_BYTES = 1024 * 1024

function sanitiseResults(results: AutomationResults, maxLogSizeMb: number) {
  const message = `[removed] - max results size of ${maxLogSizeMb}MB exceeded`
  for (let step of results.steps) {
    step.inputs = {
      message,
    }
    step.outputs = {
      message,
      success: step.outputs.success,
    }
  }
}

export async function storeLog(
  automation: Automation,
  results: AutomationResults
) {
  // can disable this if un-needed in self-host, also only do this for prod apps
  if (env.DISABLE_AUTOMATION_LOGS) {
    return
  }
  const maxLogSizeMb = env.AUTOMATION_MAX_LOG_SIZE_MB
  const bytes = sizeof(results)
  if (bytes / MB_IN_BYTES > maxLogSizeMb) {
    sanitiseResults(results, maxLogSizeMb)
  }
  try {
    await automations.logs.storeLog(automation, results)
  } catch (e: any) {
    if (e.status === 413 && e.request?.data) {
      // if content is too large we shouldn't log it
      delete e.request.data
      e.request.data = { message: "removed due to large size" }
    }
    logging.logAlert("Error writing automation log", e)
  }
}

export async function checkAppMetadata(apps: Workspace[]) {
  const maxStartDate = await automations.logs.oldestLogDate()
  for (let metadata of apps) {
    if (!metadata.automationErrors) {
      continue
    }
    for (let [key, errors] of Object.entries(metadata.automationErrors)) {
      const updated = []
      for (let error of errors) {
        if (!error) {
          continue
        }
        const startDate = error.split(dbUtils.SEPARATOR)[2]
        if (startDate > maxStartDate) {
          updated.push(error)
        }
      }
      metadata.automationErrors[key] = updated
    }
  }
  return apps
}
