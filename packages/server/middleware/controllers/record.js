const couchdb = require("../../db")
const { schemaValidator } = require("@budibase/common")

exports.save = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId)
  const record = ctx.request.body

  // validation with ajv
  const model = await db.get(record.modelId)
  const validate = schemaValidator.compile(model.schema)
  const valid = validate(record)

  const isUpdate = record._rev

  if (!valid) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      errors: validate.errors,
    }
    return
  }

  //const existingRecord = record._rev && (await db.get(record._id))

  record.type = "record"
  const response = await db.insert(record)
  record._rev = response.rev
  // await ctx.publish(events.recordApi.save.onRecordCreated, {
  //   record: record,
  // })

  ctx.body = record
  ctx.status = 200
  ctx.message = `${model.name} ${isUpdate ? "updated" : "created"} successfully`
}

exports.fetch = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId)
  const viewName = `all_${ctx.params.modelId}`
  const response = await db.view("database", viewName, {
    include_docs: true,
  })
  ctx.body = response.rows.map(row => row.doc)
}

exports.find = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId)
  ctx.body = await db.get(ctx.params.recordId)
}

exports.destroy = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId)
  ctx.body = await db.destroy(ctx.params.recordId, ctx.params.revId)
}
