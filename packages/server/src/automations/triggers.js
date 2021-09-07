const CouchDB = require("../db")
const emitter = require("../events/index")
const env = require("../environment")
const Queue = env.isTest()
  ? require("../utilities/queue/inMemoryQueue")
  : require("bull")
const { getAutomationParams } = require("../db/utils")
const { coerce } = require("../utilities/rowProcessor")
const { utils } = require("@budibase/auth/redis")
const { JobQueues } = require("../constants")
const { definitions } = require("./triggerInfo")
const { isDevAppID } = require("../db/utils")

const { opts } = utils.getRedisOptions()
let automationQueue = new Queue(JobQueues.AUTOMATIONS, { redis: opts })

const TRIGGER_DEFINITIONS = definitions

async function queueRelevantRowAutomations(event, eventType) {
  if (event.appId == null) {
    throw `No appId specified for ${eventType} - check event emitters.`
  }
  // don't queue events which are for dev apps, only way to test automations is
  // running tests on them
  if (isDevAppID(event.appId)) {
    return
  }
  const db = new CouchDB(event.appId)
  let automations = await db.allDocs(
    getAutomationParams(null, { include_docs: true })
  )

  // filter down to the correct event type
  automations = automations.rows
    .map(automation => automation.doc)
    .filter(automation => {
      const trigger = automation.definition.trigger
      return trigger && trigger.event === eventType
    })

  for (let automation of automations) {
    let automationDef = automation.definition
    let automationTrigger = automationDef ? automationDef.trigger : {}
    if (
      !automation.live ||
      !automationTrigger.inputs ||
      automationTrigger.inputs.tableId !== event.row.tableId
    ) {
      continue
    }
    await automationQueue.add({ automation, event })
  }
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

exports.externalTrigger = async function (automation, params) {
  if (automation.definition != null && automation.definition.trigger != null) {
    if (automation.definition.trigger.stepId === "APP") {
      // values are likely to be submitted as strings, so we shall convert to correct type
      const coercedFields = {}
      const fields = automation.definition.trigger.inputs.fields
      for (let key of Object.keys(fields)) {
        coercedFields[key] = coerce(params.fields[key], fields[key])
      }
      params.fields = coercedFields
    }
  }

  await automationQueue.add({ automation, event: params })
}

exports.getQueues = () => {
  return [automationQueue]
}
exports.automationQueue = automationQueue

exports.TRIGGER_DEFINITIONS = TRIGGER_DEFINITIONS
