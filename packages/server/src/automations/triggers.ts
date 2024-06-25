import emitter from "../events/index"
import { getAutomationParams, isDevAppID } from "../db/utils"
import { coerce } from "../utilities/rowProcessor"
import { definitions } from "./triggerInfo"
// need this to call directly, so we can get a response
import { automationQueue } from "./bullboard"
import { checkTestFlag } from "../utilities/redis"
import * as utils from "./utils"
import env from "../environment"
import { context, db as dbCore } from "@budibase/backend-core"
import {
  Automation,
  Row,
  AutomationData,
  AutomationJob,
  AutomationEventType,
  UpdatedRowEventEmitter,
} from "@budibase/types"
import { executeInThread } from "../threads/automation"

export const TRIGGER_DEFINITIONS = definitions
const JOB_OPTS = {
  removeOnComplete: true,
  removeOnFail: true,
}

async function getAllAutomations() {
  const db = context.getAppDB()
  let automations = await db.allDocs<Automation>(
    getAutomationParams(null, { include_docs: true })
  )
  return automations.rows.map(row => row.doc!)
}

async function queueRelevantRowAutomations(
  event: { appId: string; row: Row },
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
      if (
        automationTrigger?.inputs &&
        automationTrigger.inputs.tableId === event.row.tableId
      ) {
        await automationQueue.add({ automation, event }, JOB_OPTS)
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

export async function externalTrigger(
  automation: Automation,
  params: { fields: Record<string, any>; timeout?: number },
  { getResponses }: { getResponses?: boolean } = {}
): Promise<any> {
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
