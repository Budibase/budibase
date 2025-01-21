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
  AutomationRowEvent,
  UserBindings,
  AutomationResults,
} from "@budibase/types"
import { executeInThread } from "../threads/automation"
import { dataFilters, sdk } from "@budibase/shared-core"

export const TRIGGER_DEFINITIONS = definitions
const JOB_OPTS = {
  removeOnComplete: true,
  removeOnFail: true,
}
import * as automationUtils from "../automations/automationUtils"
import { doesTableExist } from "../sdk/app/tables/getters"

type DidNotTriggerResponse = {
  outputs: {
    success: false
    status: AutomationStatus.STOPPED
  }
  message: AutomationStoppedReason.TRIGGER_FILTER_NOT_MET
}

async function getAllAutomations() {
  const db = context.getAppDB()
  let automations = await db.allDocs<Automation>(
    getAutomationParams(null, { include_docs: true })
  )
  return automations.rows.map(row => row.doc!)
}

async function queueRelevantRowAutomations(
  event: AutomationRowEvent,
  eventType: AutomationEventType
) {
  const tableId = event.row.tableId
  if (event.appId == null) {
    throw `No appId specified for ${eventType} - check event emitters.`
  }

  // make sure table exists and is valid before proceeding
  if (!tableId || !(await doesTableExist(tableId))) {
    return
  }

  await context.doInAppContext(event.appId, async () => {
    let automations = await getAllAutomations()

    // filter down to the correct event type and enabled automations
    // make sure it is the correct table ID as well
    automations = automations.filter(automation => {
      const trigger = automation.definition.trigger
      return (
        trigger &&
        trigger.event === eventType &&
        !automation.disabled &&
        trigger?.inputs?.tableId === event.row.tableId
      )
    })

    for (const automation of automations) {
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

      const shouldTrigger = await checkTriggerFilters(automation, {
        row: event.row,
        oldRow: event.oldRow,
      })
      if (shouldTrigger) {
        try {
          await automationQueue.add({ automation, event }, JOB_OPTS)
        } catch (e) {
          logging.logAlert("Failed to queue automation", e)
        }
      }
    }
  })
}

async function queueRowAutomations(
  event: AutomationRowEvent,
  type: AutomationEventType
) {
  try {
    await queueRelevantRowAutomations(event, type)
  } catch (err: any) {
    logging.logWarn("Unable to process row event", err)
  }
}

emitter.on(
  AutomationEventType.ROW_SAVE,
  async function (event: UpdatedRowEventEmitter) {
    /* istanbul ignore next */
    if (!event || !event.row || !event.row.tableId) {
      return
    }
    await queueRowAutomations(event, AutomationEventType.ROW_SAVE)
  }
)

emitter.on(AutomationEventType.ROW_UPDATE, async function (event) {
  /* istanbul ignore next */
  if (!event || !event.row || !event.row.tableId) {
    return
  }
  await queueRowAutomations(event, AutomationEventType.ROW_UPDATE)
})

emitter.on(AutomationEventType.ROW_DELETE, async function (event) {
  /* istanbul ignore next */
  if (!event || !event.row || !event.row.tableId) {
    return
  }
  await queueRowAutomations(event, AutomationEventType.ROW_DELETE)
})

function rowPassesFilters(row: Row, filters: SearchFilters) {
  const filteredRows = dataFilters.runQuery([row], filters)
  return filteredRows.length > 0
}

export function isAutomationResults(
  response: AutomationResults | DidNotTriggerResponse | AutomationJob
): response is AutomationResults {
  return (
    response !== null && "steps" in response && Array.isArray(response.steps)
  )
}

export async function externalTrigger(
  automation: Automation,
  params: {
    fields: Record<string, any>
    timeout?: number
    appId?: string
    user?: UserBindings
  },
  { getResponses }: { getResponses?: boolean } = {}
): Promise<AutomationResults | DidNotTriggerResponse | AutomationJob> {
  if (automation.disabled) {
    throw new Error("Automation is disabled")
  }

  if (
    sdk.automations.isAppAction(automation) &&
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
  // row actions and webhooks flatten the fields down
  else if (
    sdk.automations.isRowAction(automation) ||
    sdk.automations.isWebhookAction(automation)
  ) {
    params = {
      ...params,
      ...params.fields,
      fields: {},
    }
  }
  const data: AutomationData = { automation, event: params }

  const shouldTrigger = await checkTriggerFilters(automation, {
    row: data.event?.row ?? {},
    oldRow: data.event?.oldRow ?? {},
  })

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
  event: { row: Row; oldRow: Row }
): Promise<boolean> {
  const trigger = automation.definition.trigger
  const filters = trigger?.inputs?.filters
  const tableId = trigger?.inputs?.tableId

  if (!filters) {
    return true
  }

  if (
    trigger.stepId === definitions.ROW_UPDATED.stepId ||
    trigger.stepId === definitions.ROW_SAVED.stepId
  ) {
    const newRow = await automationUtils.cleanUpRow(tableId, event.row)
    return rowPassesFilters(newRow, filters)
  }
  return true
}
