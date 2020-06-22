const CouchDB = require("../../../db")
const newid = require("../../../db/newid")

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

exports.executeAction = async function(ctx) {
  const { args, action } = ctx.request.body
  const workflowAction = require(`./actions/${action}`)
  const response = await workflowAction({
    args,
    instanceId: ctx.user.instanceId,
  })
  ctx.body = response
}

exports.fetchActionScript = async function(ctx) {
  const workflowAction = require(`./actions/${ctx.action}`)
  ctx.body = workflowAction
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  ctx.body = await db.remove(ctx.params.id, ctx.params.rev)
}
