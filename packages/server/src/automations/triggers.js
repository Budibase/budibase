const emitter = require("../events/index")
const { getAutomationParams } = require("../db/utils")
const { coerce } = require("../utilities/rowProcessor")
const { definitions } = require("./triggerInfo")
const { isDevAppID } = require("../db/utils")
// need this to call directly, so we can get a response
const { automationQueue } = require("./bullboard")
const { checkTestFlag } = require("../utilities/redis")
const utils = require("./utils")
const env = require("../environment")
const { doInAppContext, getAppDB } = require("@budibase/backend-core/context")
const { getAllApps } = require("@budibase/backend-core/db")

const TRIGGER_DEFINITIONS = definitions
const JOB_OPTS = {
  removeOnComplete: true,
  removeOnFail: true,
}

async function getAllAutomations() {
  const db = getAppDB()
  let automations = await db.allDocs(
    getAutomationParams(null, { include_docs: true })
  )
  return automations.rows.map(row => row.doc)
}

async function queueRelevantRowAutomations(event, eventType) {
  if (event.appId == null) {
    throw `No appId specified for ${eventType} - check event emitters.`
  }

  doInAppContext(event.appId, async () => {
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

exports.externalTrigger = async function (
  automation,
  params,
  { getResponses } = {}
) {
  if (
    automation.definition != null &&
    automation.definition.trigger != null &&
    automation.definition.trigger.stepId === definitions.APP.stepId &&
    automation.definition.trigger.stepId === "APP" &&
    !(await checkTestFlag(automation._id))
  ) {
    // values are likely to be submitted as strings, so we shall convert to correct type
    const coercedFields = {}
    const fields = automation.definition.trigger.inputs.fields
    for (let key of Object.keys(fields || {})) {
      coercedFields[key] = coerce(params.fields[key], fields[key])
    }
    params.fields = coercedFields
  }
  const data = { automation, event: params }
  if (getResponses) {
    return utils.processEvent({ data })
  } else {
    return automationQueue.add(data, JOB_OPTS)
  }
}

exports.rebootTrigger = async () => {
  // reboot cron option is only available on the main thread at
  // startup and only usable in self host and single tenant environments
  if (env.isInThread() || !env.SELF_HOSTED || env.MULTI_TENANCY) {
    return
  }
  // iterate through all production apps, find the reboot crons
  // and trigger events for them
  const appIds = await getAllApps({ dev: false, idsOnly: true })
  for (let prodAppId of appIds) {
    await doInAppContext(prodAppId, async () => {
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

exports.TRIGGER_DEFINITIONS = TRIGGER_DEFINITIONS
