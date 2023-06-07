import emitter from "../events/index"
import { getAutomationParams } from "../db/utils"
import { coerce } from "../utilities/rowProcessor"
import { definitions } from "./triggerInfo"
import { isDevAppID } from "../db/utils"
// need this to call directly, so we can get a response
import { automationQueue } from "./bullboard"
import { checkTestFlag } from "../utilities/redis"
import * as utils from "./utils"
import env from "../environment"
import { context, db as dbCore } from "@budibase/backend-core"
import { Automation, Row, AutomationData, AutomationJob } from "@budibase/types"
import { executeSynchronously } from "../threads/automation"

export const TRIGGER_DEFINITIONS = definitions
const JOB_OPTS = {
  removeOnComplete: true,
  removeOnFail: true,
}

async function getAllAutomations() {
  const db = context.getAppDB()
  let automations = await db.allDocs(
    getAutomationParams(null, { include_docs: true })
  )
  return automations.rows.map(row => row.doc)
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

    // filter down to the correct event type
    automations = automations.filter(automation => {
      const trigger = automation.definition.trigger
      return trigger && trigger.event === eventType
    })

    for (let automation of automations) {
      let automationDef = automation.definition
      let automationTrigger = automationDef ? automationDef.trigger : {}
      // don't queue events which are for dev apps, only way to test automations is
      // running tests on them, in production the test flag will never
      // be checked due to lazy evaluation (first always false)
      if (
        !env.ALLOW_DEV_AUTOMATIONS &&
        isDevAppID(event.appId) &&
        !(await checkTestFlag(automation._id))
      ) {
        continue
      }
      if (
        automationTrigger.inputs &&
        automationTrigger.inputs.tableId === event.row.tableId
      ) {
        await automationQueue.add({ automation, event }, JOB_OPTS)
      }
    }
  })
}

emitter.on("row:save", async function (event) {
  /* istanbul ignore next */
  if (!event || !event.row || !event.row.tableId) {
    return
  }
  await queueRelevantRowAutomations(event, "row:save")
})

emitter.on("row:update", async function (event) {
  /* istanbul ignore next */
  if (!event || !event.row || !event.row.tableId) {
    return
  }
  await queueRelevantRowAutomations(event, "row:update")
})

emitter.on("row:delete", async function (event) {
  /* istanbul ignore next */
  if (!event || !event.row || !event.row.tableId) {
    return
  }
  await queueRelevantRowAutomations(event, "row:delete")
})

export async function externalTrigger(
  automation: Automation,
  params: { fields: Record<string, any>; timeout?: number },
  { getResponses }: { getResponses?: boolean } = {}
) {
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
    const job = { data } as AutomationJob
    return executeSynchronously(job)
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
