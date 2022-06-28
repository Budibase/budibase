import { getAppId, getProdAppDB } from "@budibase/backend-core/context"
import {
  DocumentTypes,
  generateAutomationLogID,
  isProdAppID,
  SEPARATOR,
} from "../../db/utils"
import { Automation, MetadataErrors } from "../../definitions/common"
import { app } from "@budibase/backend-core/cache"
import { backOff } from "../../utilities"
import * as env from "../../environment"
import { logs } from "@budibase/pro"
import {
  AutomationResults,
  AutomationStatus,
} from "../../definitions/automation"

const { logAlert } = require("@budibase/backend-core/logging")

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
      break
    } else if (step.outputs?.status?.toLowerCase() === "stopped") {
      status = AutomationStatus.STOPPED
      break
    }
  }
  return status
}

export async function clearOldHistory() {
  const db = getProdAppDB()
  try {
    const expired = await logs.automations.getExpiredLogs()
    const toDelete = expired.data.map((doc: any) => ({
      _id: doc.id,
      _rev: doc.value.rev,
      _deleted: true,
    }))
    const errorLogIds = expired.data
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
  } catch (err) {
    logAlert(`Failed to cleanup automation log history - Database "${db.name}"`)
  }
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
