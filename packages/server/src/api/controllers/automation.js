const CouchDB = require("../../db")
const actions = require("../../automations/actions")
const logic = require("../../automations/logic")
const triggers = require("../../automations/triggers")
const webhooks = require("./webhook")
const { getAutomationParams, generateAutomationID } = require("../../db/utils")

const WH_STEP_ID = triggers.BUILTIN_DEFINITIONS.WEBHOOK.stepId
/*************************
 *                       *
 *   BUILDER FUNCTIONS   *
 *                       *
 *************************/

function cleanAutomationInputs(automation) {
  if (automation == null) {
    return automation
  }
  let steps = automation.definition.steps
  let trigger = automation.definition.trigger
  let allSteps = [...steps, trigger]
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

/**
 * This function handles checking if any webhooks need to be created or deleted for automations.
 * @param {object} user The user object, including all auth info
 * @param {object|undefined} oldAuto The old automation object if updating/deleting
 * @param {object|undefined} newAuto The new automation object if creating/updating
 * @returns {Promise<object|undefined>} After this is complete the new automation object may have been updated and should be
 * written to DB (this does not write to DB as it would be wasteful to repeat).
 */
async function checkForWebhooks({ user, oldAuto, newAuto }) {
  function isWebhookTrigger(auto) {
    return (
      auto &&
      auto.definition.trigger &&
      auto.definition.trigger.stepId === WH_STEP_ID
    )
  }
  // need to delete webhook
  if (
    isWebhookTrigger(oldAuto) &&
    !isWebhookTrigger(newAuto) &&
    oldAuto.definition.trigger.webhook
  ) {
    const ctx = {
      user,
      params: {
        id: oldAuto.definition.trigger.webhook.id,
        rev: oldAuto.definition.trigger.webhook.rev,
      },
    }
    // reset the inputs to remove the URLs
    if (newAuto && newAuto.definition.trigger) {
      const trigger = newAuto.definition.trigger
      delete trigger.webhook
      delete trigger.inputs.schemaUrl
      delete trigger.inputs.triggerUrl
    }
    await webhooks.destroy(ctx)
  }
  // need to create webhook
  else if (!isWebhookTrigger(oldAuto) && isWebhookTrigger(newAuto)) {
    const ctx = {
      user,
      request: {
        body: new webhooks.Webhook(
          "Automation webhook",
          webhooks.WebhookType.AUTOMATION,
          newAuto._id
        ),
      },
    }
    await webhooks.save(ctx)
    const id = ctx.body.webhook._id,
      rev = ctx.body.webhook._rev
    newAuto.definition.trigger.webhook = { id, rev }
    newAuto.definition.trigger.inputs = {
      schemaUrl: `api/webhooks/schema/${user.instanceId}/${id}`,
      triggerUrl: `api/webhooks/trigger/${user.instanceId}/${id}`,
    }
  }
  return newAuto
}

exports.create = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  let automation = ctx.request.body
  automation.appId = ctx.user.appId

  automation._id = generateAutomationID()

  automation.type = "automation"
  automation = cleanAutomationInputs(automation)
  automation = await checkForWebhooks({ user: ctx.user, newAuto: automation })
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

exports.update = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  let automation = ctx.request.body
  automation.appId = ctx.user.appId
  const oldAutomation = await db.get(automation._id)
  automation = cleanAutomationInputs(automation)
  automation = await checkForWebhooks({
    user: ctx.user,
    oldAuto: oldAutomation,
    newAuto: automation,
  })
  const response = await db.put(automation)
  automation._rev = response.rev

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

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const response = await db.allDocs(
    getAutomationParams(null, {
      include_docs: true,
    })
  )
  ctx.body = response.rows.map(row => row.doc)
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  ctx.body = await db.get(ctx.params.id)
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const oldAutomation = await db.get(ctx.params.id)
  await checkForWebhooks({ user: ctx.user, oldAuto: oldAutomation })
  ctx.body = await db.remove(ctx.params.id, ctx.params.rev)
}

exports.getActionList = async function(ctx) {
  ctx.body = actions.DEFINITIONS
}

exports.getTriggerList = async function(ctx) {
  ctx.body = triggers.BUILTIN_DEFINITIONS
}

exports.getLogicList = async function(ctx) {
  ctx.body = logic.BUILTIN_DEFINITIONS
}

module.exports.getDefinitionList = async function(ctx) {
  ctx.body = {
    logic: logic.BUILTIN_DEFINITIONS,
    trigger: triggers.BUILTIN_DEFINITIONS,
    action: actions.DEFINITIONS,
  }
}

/*********************
 *                   *
 *   API FUNCTIONS   *
 *                   *
 *********************/

exports.trigger = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  let automation = await db.get(ctx.params.id)
  await triggers.externalTrigger(automation, {
    ...ctx.request.body,
    instanceId: ctx.user.instanceId,
  })
  ctx.status = 200
  ctx.body = {
    message: `Automation ${automation._id} has been triggered.`,
    automation,
  }
}
