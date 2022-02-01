const emitter = require("../events/index")
const { getAutomationParams } = require("../db/utils")
const { coerce } = require("../utilities/rowProcessor")
const { definitions } = require("./triggerInfo")
const { isDevAppID } = require("../db/utils")
// need this to call directly, so we can get a response
const { queue } = require("./bullboard")
const { checkTestFlag } = require("../utilities/redis")
const utils = require("./utils")
const env = require("../environment")
const { doInAppContext, getAppDB } = require("@budibase/backend-core/context")

const TRIGGER_DEFINITIONS = definitions
const JOB_OPTS = {
  removeOnComplete: true,
  removeOnFail: true,
}

async function queueRelevantRowAutomations(event, eventType) {
  if (event.appId == null) {
    throw `No appId specified for ${eventType} - check event emitters.`
  }

  doInAppContext(event.appId, async () => {
    const db = getAppDB()
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
        await queue.add({ automation, event }, JOB_OPTS)
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
    for (let key of Object.keys(fields)) {
      coercedFields[key] = coerce(params.fields[key], fields[key])
    }
    params.fields = coercedFields
  }
  const data = { automation, event: params }
  if (getResponses) {
    return utils.processEvent({ data })
  } else {
    return queue.add(data, JOB_OPTS)
  }
}

exports.TRIGGER_DEFINITIONS = TRIGGER_DEFINITIONS
