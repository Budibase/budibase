const actions = require("../../automations/actions")
const triggers = require("../../automations/triggers")
const { getAutomationParams, generateAutomationID } = require("../../db/utils")
const {
  checkForWebhooks,
  updateTestHistory,
  removeDeprecated,
} = require("../../automations/utils")
const { deleteEntityMetadata } = require("../../utilities")
const { MetadataTypes } = require("../../constants")
const { setTestFlag, clearTestFlag } = require("../../utilities/redis")
const { getAppDB } = require("@budibase/backend-core/context")

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
      : {}
  const newAutoTrigger =
    automation && automation.definition.trigger
      ? automation.definition.trigger
      : {}
  // trigger has been updated, remove the test inputs
  if (oldAutoTrigger.id !== newAutoTrigger.id) {
    await deleteEntityMetadata(
      ctx.appId,
      MetadataTypes.AUTOMATION_TEST_INPUT,
      automation._id
    )
  }

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
}
