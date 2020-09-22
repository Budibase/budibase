const CouchDB = require("../../db")
const newid = require("../../db/newid")
const actions = require("../../workflows/actions")
const logic = require("../../workflows/logic")
const triggers = require("../../workflows/triggers")

/*************************
 *                       *
 *   BUILDER FUNCTIONS   *
 *                       *
 *************************/

function cleanWorkflowInputs(workflow) {
  if (workflow == null) {
    return workflow
  }
  let steps = workflow.definition.steps
  let trigger = workflow.definition.trigger
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
  return workflow
}

exports.create = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  let workflow = ctx.request.body

  workflow._id = newid()

  workflow.type = "workflow"
  workflow = cleanWorkflowInputs(workflow)
  const response = await db.post(workflow)
  workflow._rev = response.rev

  ctx.status = 200
  ctx.body = {
    message: "Workflow created successfully",
    workflow: {
      ...workflow,
      ...response,
    },
  }
}

exports.update = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  let workflow = ctx.request.body

  workflow = cleanWorkflowInputs(workflow)
  const response = await db.put(workflow)
  workflow._rev = response.rev

  ctx.status = 200
  ctx.body = {
    message: `Workflow ${workflow._id} updated successfully.`,
    workflow: {
      ...workflow,
      _rev: response.rev,
      _id: response.id,
    },
  }
}

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const response = await db.query(`database/by_type`, {
    key: ["workflow"],
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
  let workflow = await db.get(ctx.params.id)
  await triggers.externalTrigger(workflow, {
    ...ctx.request.body,
    instanceId: ctx.user.instanceId,
  })
  ctx.status = 200
  ctx.body = {
    message: `Workflow ${workflow._id} has been triggered.`,
    workflow,
  }
}
