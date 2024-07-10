import emitter from "../events/index"
import { getAutomationParams, isDevAppID } from "../db/utils"
import { coerce } from "../utilities/rowProcessor"
import { definitions } from "./triggerInfo"
// need this to call directly, so we can get a response
import { automationQueue } from "./bullboard"
import { checkTestFlag } from "../utilities/redis"
import * as utils from "./utils"
import env from "../environment"
import { context, logging, db as dbCore } from "@budibase/backend-core"
import {
  Automation,
  Row,
  AutomationData,
  AutomationJob,
  AutomationEventType,
  UpdatedRowEventEmitter,
  SearchFilters,
  AutomationStoppedReason,
  AutomationStatus,
} from "@budibase/types"
import { executeInThread } from "../threads/automation"
import { dataFilters } from "@budibase/shared-core"

export const TRIGGER_DEFINITIONS = definitions
const JOB_OPTS = {
  removeOnComplete: true,
  removeOnFail: true,
}
import * as automationUtils from "../automations/automationUtils"

async function getAllAutomations() {
  const db = context.getAppDB()
  let automations = await db.allDocs<Automation>(
    getAutomationParams(null, { include_docs: true })
  )
  return automations.rows.map(row => row.doc!)
}

async function queueRelevantRowAutomations(
  event: { appId: string; row: Row; oldRow: Row },
  eventType: string
) {
  if (event.appId == null) {
    throw `No appId specified for ${eventType} - check event emitters.`
  }

  await context.doInAppContext(event.appId, async () => {
    let automations = await getAllAutomations()

    // filter down to the correct event type and enabled automations
    automations = automations.filter(automation => {
      const trigger = automation.definition.trigger
      return trigger && trigger.event === eventType && !automation.disabled
    })

    for (let automation of automations) {
      let automationDef = automation.definition
      let automationTrigger = automationDef?.trigger
      // don't queue events which are for dev apps, only way to test automations is
      // running tests on them, in production the test flag will never
      // be checked due to lazy evaluation (first always false)
      if (
        !env.ALLOW_DEV_AUTOMATIONS &&
        isDevAppID(event.appId) &&
        !(await checkTestFlag(automation._id!))
      ) {
        continue
      }
      const tableId = automation.definition.trigger?.inputs?.tableId
      const filters = automation.definition.trigger?.inputs?.filters

      const shouldTrigger = await checkTriggerFilters(
        automation,
        filters,
        tableId,
        { row: event.row, oldRow: event.oldRow }
      )

      if (
        automationTrigger?.inputs &&
        automationTrigger.inputs.tableId === event.row.tableId &&
        shouldTrigger
      ) {
        try {
          await automationQueue.add({ automation, event }, JOB_OPTS)
        } catch (e) {
          logging.logAlert("Failed to queue automation", e)
        }
      }
    }
  })
}

emitter.on(
  AutomationEventType.ROW_SAVE,
  async function (event: UpdatedRowEventEmitter) {
    /* istanbul ignore next */
    if (!event || !event.row || !event.row.tableId) {
      return
    }
    await queueRelevantRowAutomations(event, AutomationEventType.ROW_SAVE)
  }
)

emitter.on(AutomationEventType.ROW_UPDATE, async function (event) {
  /* istanbul ignore next */
  if (!event || !event.row || !event.row.tableId) {
    return
  }
  await queueRelevantRowAutomations(event, AutomationEventType.ROW_UPDATE)
})

emitter.on(AutomationEventType.ROW_DELETE, async function (event) {
  /* istanbul ignore next */
  if (!event || !event.row || !event.row.tableId) {
    return
  }
  await queueRelevantRowAutomations(event, AutomationEventType.ROW_DELETE)
})

function rowPassesFilters(row: Row, filters: SearchFilters) {
  const filteredRows = dataFilters.runQuery([row], filters)
  return filteredRows.length > 0
}

export async function externalTrigger(
  automation: Automation,
  params: { fields: Record<string, any>; timeout?: number },
  { getResponses }: { getResponses?: boolean } = {}
): Promise<any> {
  let shouldTrigger = true
  const tableId = automation.definition.trigger?.inputs?.tableId
  const filters = automation.definition.trigger?.inputs?.filters

  if (automation.disabled) {
    throw new Error("Automation is disabled")
  }
  if (
    automation.definition != null &&
    automation.definition.trigger != null &&
    automation.definition.trigger.stepId === definitions.APP.stepId &&
    automation.definition.trigger.stepId === "APP" &&
    !(await checkTestFlag(automation._id!))
  ) {
    // values are likely to be submitted as strings, so we shall convert to correct type
    const coercedFields: any = {}
    const fields = automation.definition.trigger.inputs.fields
    for (let key of Object.keys(fields || {})) {
      coercedFields[key] = coerce(params.fields[key], fields[key])
    }
    params.fields = coercedFields
  }
  const data: AutomationData = { automation, event: params as any }

  // shouldTrigger is defaulted to true for safety, the only instances we could set to false
  // are ones where filters exist in a create or update row trigger so just gate that
  if (
    filters &&
    [definitions.ROW_UPDATED.stepId, definitions.ROW_SAVED.stepId].includes(
      automation.definition.trigger.stepId
    )
  ) {
    shouldTrigger = await checkTriggerFilters(automation, filters, tableId, {
      row: data.event?.row ?? {},
      oldRow: data.event?.oldRow ?? {},
    })
  }

  if (!shouldTrigger) {
    return {
      outputs: {
        success: false,
        status: AutomationStatus.STOPPED,
      },
      message: AutomationStoppedReason.TRIGGER_FILTER_NOT_MET,
    }
  }

  if (getResponses) {
    data.event = {
      ...data.event,
      appId: context.getAppId(),
      automation,
    }
    return executeInThread({ data } as AutomationJob)
  } else {
    return automationQueue.add(data, JOB_OPTS)
  }
}

export async function rebootTrigger() {
  // reboot cron option is only available on the main thread at
  // startup and only usable in self host and single tenant environments
  if (env.isInThread() || !env.SELF_HOSTED || env.MULTI_TENANCY) {
    return
  }
  // iterate through all production apps, find the reboot crons
  // and trigger events for them
  const appIds = (await dbCore.getAllApps({
    dev: false,
    idsOnly: true,
  })) as string[]
  for (let prodAppId of appIds) {
    await context.doInAppContext(prodAppId, async () => {
      let automations = await getAllAutomations()
      let rebootEvents = []
      for (let automation of automations) {
        if (utils.isRebootTrigger(automation)) {
          const job = {
            automation,
            event: {
              appId: prodAppId,
              timestamp: Date.now(),
            },
          }
          rebootEvents.push(automationQueue.add(job, JOB_OPTS))
        }
      }
      await Promise.all(rebootEvents)
    })
  }
}

async function checkTriggerFilters(
  automation: Automation,
  filters: SearchFilters,
  tableId: string,
  comparisonRows: { row: Row; oldRow: Row }
): Promise<boolean> {
  const newRow = await automationUtils.cleanUpRow(tableId, comparisonRows.row)
  const newRowPasses = rowPassesFilters(newRow, filters)

  if (automation.definition.trigger.stepId === definitions.ROW_UPDATED.stepId) {
    // This variable indicates that the trigger should run even if the new row matches the old row
    // So if the filter is "equals true" and new row is `true` and old row is `true` it will still run
    let onlyExecuteFilterIfChange =
      automation.definition.trigger.inputs.meta?.onlyExecuteFilterIfChange ??
      true

    const oldRow = await automationUtils.cleanUpRow(
      tableId,
      comparisonRows.oldRow
    )
    const oldRowPasses = rowPassesFilters(oldRow, filters)

    if (onlyExecuteFilterIfChange) {
      return !oldRowPasses && newRowPasses
    } else {
      return newRowPasses
    }
  } else if (
    automation.definition.trigger.stepId === definitions.ROW_SAVED.stepId
  ) {
    // For ROW_SAVED, trigger if new row passes the filter
    return newRowPasses
  }

  return true
}
