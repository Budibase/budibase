const CouchDB = require("../../../db")
const newid = require("../../../db/newid")
const blockDefinitions = require("./blockDefinitions")
const triggers = require("../../../workflows/triggers")

/*************************
 *                       *
 *   BUILDER FUNCTIONS   *
 *                       *
 *************************/

exports.create = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const workflow = ctx.request.body

  workflow._id = newid()

  workflow.type = "workflow"
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
  const workflow = ctx.request.body

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
  ctx.body = blockDefinitions.ACTION
}

exports.getTriggerList = async function(ctx) {
  ctx.body = blockDefinitions.TRIGGER
}

exports.getLogicList = async function(ctx) {
  ctx.body = blockDefinitions.LOGIC
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
