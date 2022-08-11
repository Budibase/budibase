const actions = require("../../automations/actions")
const triggers = require("../../automations/triggers")
const {
  getAutomationParams,
  generateAutomationID,
  DocumentType,
} = require("../../db/utils")
const {
  checkForWebhooks,
  updateTestHistory,
  removeDeprecated,
} = require("../../automations/utils")
const { deleteEntityMetadata } = require("../../utilities")
const { MetadataTypes } = require("../../constants")
const { setTestFlag, clearTestFlag } = require("../../utilities/redis")
const {
  getAppDB,
  getProdAppDB,
  doInAppContext,
} = require("@budibase/backend-core/context")
const { events } = require("@budibase/backend-core")
const { app } = require("@budibase/backend-core/cache")
const { automations } = require("@budibase/pro")

const ACTION_DEFS = removeDeprecated(actions.ACTION_DEFINITIONS)
const TRIGGER_DEFS = removeDeprecated(triggers.TRIGGER_DEFINITIONS)

/*************************
 *                       *
 *   BUILDER FUNCTIONS   *
 *                       *
 *************************/

async function cleanupAutomationMetadata(automationId) {
  await deleteEntityMetadata(MetadataTypes.AUTOMATION_TEST_INPUT, automationId)
  await deleteEntityMetadata(
    MetadataTypes.AUTOMATION_TEST_HISTORY,
    automationId
  )
}

function cleanAutomationInputs(automation) {
  if (automation == null) {
    return automation
  }
  let steps = automation.definition.steps
  let trigger = automation.definition.trigger
  let allSteps = [...steps, trigger]
  // live is not a property used anymore
  if (automation.live != null) {
    delete automation.live
  }
  for (let step of allSteps) {
    if (step == null) {
      continue
    }
    for (let inputName of Object.keys(step.inputs)) {
      if (!step.inputs[inputName] || step.inputs[inputName] === "") {
        delete step.inputs[inputName]
      }
    }
  }
  return automation
}

exports.create = async function (ctx) {
  const db = getAppDB()
  let automation = ctx.request.body
  automation.appId = ctx.appId

  // call through to update if already exists
  if (automation._id && automation._rev) {
    return exports.update(ctx)
  }

  automation._id = generateAutomationID()

  automation.type = "automation"
  automation = cleanAutomationInputs(automation)
  automation = await checkForWebhooks({
    newAuto: automation,
  })
  const response = await db.put(automation)
  await events.automation.created(automation)
  for (let step of automation.definition.steps) {
    await events.automation.stepCreated(automation, step)
  }
  automation._rev = response.rev

  ctx.status = 200
  ctx.body = {
    message: "Automation created successfully",
    automation: {
      ...automation,
      ...response,
    },
  }
}

const getNewSteps = (oldAutomation, automation) => {
  const oldStepIds = oldAutomation.definition.steps.map(s => s.id)
  return automation.definition.steps.filter(s => !oldStepIds.includes(s.id))
}

const getDeletedSteps = (oldAutomation, automation) => {
  const stepIds = automation.definition.steps.map(s => s.id)
  return oldAutomation.definition.steps.filter(s => !stepIds.includes(s.id))
}

const handleStepEvents = async (oldAutomation, automation) => {
  // new steps
  const newSteps = getNewSteps(oldAutomation, automation)
  for (let step of newSteps) {
    await events.automation.stepCreated(automation, step)
  }

  // old steps
  const deletedSteps = getDeletedSteps(oldAutomation, automation)
  for (let step of deletedSteps) {
    await events.automation.stepDeleted(automation, step)
  }
}

exports.update = async function (ctx) {
  const db = getAppDB()
  let automation = ctx.request.body
  automation.appId = ctx.appId
  const oldAutomation = await db.get(automation._id)
  automation = cleanAutomationInputs(automation)
  automation = await checkForWebhooks({
    oldAuto: oldAutomation,
    newAuto: automation,
  })
  const response = await db.put(automation)
  automation._rev = response.rev

  const oldAutoTrigger =
    oldAutomation && oldAutomation.definition.trigger
      ? oldAutomation.definition.trigger
      : undefined
  const newAutoTrigger =
    automation && automation.definition.trigger
      ? automation.definition.trigger
      : {}
  // trigger has been updated, remove the test inputs
  if (oldAutoTrigger && oldAutoTrigger.id !== newAutoTrigger.id) {
    await events.automation.triggerUpdated(automation)
    await deleteEntityMetadata(
      ctx.appId,
      MetadataTypes.AUTOMATION_TEST_INPUT,
      automation._id
    )
  }

  await handleStepEvents(oldAutomation, automation)

  ctx.status = 200
  ctx.body = {
    message: `Automation ${automation._id} updated successfully.`,
    automation: {
      ...automation,
      _rev: response.rev,
      _id: response.id,
    },
  }
}

exports.fetch = async function (ctx) {
  const db = getAppDB()
  const response = await db.allDocs(
    getAutomationParams(null, {
      include_docs: true,
    })
  )
  ctx.body = response.rows.map(row => row.doc)
}

exports.find = async function (ctx) {
  const db = getAppDB()
  ctx.body = await db.get(ctx.params.id)
}

exports.destroy = async function (ctx) {
  const db = getAppDB()
  const automationId = ctx.params.id
  const oldAutomation = await db.get(automationId)
  await checkForWebhooks({
    oldAuto: oldAutomation,
  })
  // delete metadata first
  await cleanupAutomationMetadata(automationId)
  ctx.body = await db.remove(automationId, ctx.params.rev)
  await events.automation.deleted(oldAutomation)
}

exports.logSearch = async function (ctx) {
  ctx.body = await automations.logs.logSearch(ctx.request.body)
}

exports.clearLogError = async function (ctx) {
  const { automationId, appId } = ctx.request.body
  await doInAppContext(appId, async () => {
    const db = getProdAppDB()
    const metadata = await db.get(DocumentType.APP_METADATA)
    if (!automationId) {
      delete metadata.automationErrors
    } else if (
      metadata.automationErrors &&
      metadata.automationErrors[automationId]
    ) {
      delete metadata.automationErrors[automationId]
    }
    await db.put(metadata)
    await app.invalidateAppMetadata(metadata.appId, metadata)
    ctx.body = { message: `Error logs cleared.` }
  })
}

exports.getActionList = async function (ctx) {
  ctx.body = ACTION_DEFS
}

exports.getTriggerList = async function (ctx) {
  ctx.body = TRIGGER_DEFS
}

module.exports.getDefinitionList = async function (ctx) {
  ctx.body = {
    trigger: TRIGGER_DEFS,
    action: ACTION_DEFS,
  }
}

/*********************
 *                   *
 *   API FUNCTIONS   *
 *                   *
 *********************/

exports.trigger = async function (ctx) {
  const db = getAppDB()
  let automation = await db.get(ctx.params.id)
  await triggers.externalTrigger(automation, {
    ...ctx.request.body,
    appId: ctx.appId,
  })
  ctx.body = {
    message: `Automation ${automation._id} has been triggered.`,
    automation,
  }
}

function prepareTestInput(input) {
  // prepare the test parameters
  if (input.id && input.row) {
    input.row._id = input.id
  }
  if (input.revision && input.row) {
    input.row._rev = input.revision
  }
  return input
}

exports.test = async function (ctx) {
  const db = getAppDB()
  let automation = await db.get(ctx.params.id)
  await setTestFlag(automation._id)
  const testInput = prepareTestInput(ctx.request.body)
  const response = await triggers.externalTrigger(
    automation,
    {
      ...testInput,
      appId: ctx.appId,
    },
    { getResponses: true }
  )
  // save a test history run
  await updateTestHistory(ctx.appId, automation, {
    ...ctx.request.body,
    occurredAt: new Date().getTime(),
  })
  await clearTestFlag(automation._id)
  ctx.body = response
  await events.automation.tested(automation)
}
