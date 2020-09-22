const CouchDB = require("../../db")
const newid = require("../../db/newid")
const actions = require("../../automations/actions")
const logic = require("../../automations/logic")
const triggers = require("../../automations/triggers")

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

exports.create = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  let automation = ctx.request.body

  automation._id = newid()

  automation.type = "automation"
  automation = cleanAutomationInputs(automation)
  const response = await db.post(automation)
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

  automation = cleanAutomationInputs(automation)
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
  const response = await db.query(`database/by_type`, {
    key: ["automation"],
    include_docs: true,
  })
  ctx.body = response.rows.map(row => row.doc)
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  ctx.body = await db.get(ctx.params.id)
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  ctx.body = await db.remove(ctx.params.id, ctx.params.rev)
}

exports.getActionList = async function(ctx) {
  ctx.body = actions.BUILTIN_DEFINITIONS
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
    action: actions.BUILTIN_DEFINITIONS,
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
