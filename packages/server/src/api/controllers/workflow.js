const CouchDB = require("../../db")
const Ajv = require("ajv")
const newid = require("../../db/newid")

const ajv = new Ajv()

exports.create = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  const workflow = ctx.request.body

  workflow._id = newid()

  // TODO: Possibly validate the workflow against a schema

  // // validation with ajv
  // const model = await db.get(record.modelId)
  // const validate = ajv.compile({
  //   properties: model.schema,
  // })
  // const valid = validate(record)

  // if (!valid) {
  //   ctx.status = 400
  //   ctx.body = {
  //     status: 400,
  //     errors: validate.errors,
  //   }
  //   return
  // }


  workflow.type = "workflow"
  const response = await db.post(workflow)
  workflow._rev = response.rev

  ctx.status = 200
  ctx.body = {
    message: "Workflow created successfully",
    workflow: {
      ...workflow,
      _rev: response.rev,
      _id: response.id
    }
  };
}

exports.update = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  const workflow = ctx.request.body;

  const response = await db.put(workflow)
  workflow._rev = response.rev

  ctx.status = 200
  ctx.body = {
    message: `Workflow ${workflow._id} updated successfully.`,
    workflow: {
      ...workflow,
      _rev: response.rev,
      _id: response.id
    },
  }
}

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  const response = await db.query(`database/by_type`, {
    type: "workflow",
    include_docs: true,
  })
  ctx.body = response.rows.map(row => row.doc)
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  ctx.body = await db.get(ctx.params.id)
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  ctx.body = await db.remove(ctx.params.id, ctx.params.rev)
}
