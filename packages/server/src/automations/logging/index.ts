import * as env from "../../environment"
import { AutomationResults, Automation, App } from "@budibase/types"
import { automations } from "@budibase/pro"
import { db as dbUtils } from "@budibase/backend-core"

export async function storeLog(
  automation: Automation,
  results: AutomationResults
) {
  // can disable this if un-needed in self-host, also only do this for prod apps
  if (env.DISABLE_AUTOMATION_LOGS) {
    return
  }
  await automations.logs.storeLog(automation, results)
}

export async function checkAppMetadata(apps: App[]) {
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
