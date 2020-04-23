const CouchDB = require("../../db")
const { schemaValidator } = require("@budibase/common")

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId);
  const record = ctx.request.body;

  // validation with ajv
  const model = await db.get(record.modelId)
  const validate = schemaValidator.compile(model.schema)
  const valid = validate(record)

  if (!valid) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      errors: validate.errors
    };
    return;
  }

  const existingRecord = record._id && await db.get(record._id);

  if (existingRecord) {
    const response = await db.put({ ...record, _id: existingRecord._id });
    ctx.body = {
      message: "Record updated successfully.",
      status: 200,
      record: response
    }
    return
  }

  record.type = "record"
  const response = await db.post(record)
  record._rev = response.rev
  // await ctx.publish(events.recordApi.save.onRecordCreated, {
  //   record: record,
  // })

  ctx.body = record
  ctx.status = 200
  ctx.message = `${model.name} ${record._rev ? "updated" : "created"} successfully`
}

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  const response = await db.query(
    `database/${ctx.params.viewName}`,
    {
      include_docs: true
    }
  )
  ctx.body = response.rows.map(row => row.doc);
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  ctx.body = await db.get(ctx.params.recordId)
}

exports.destroy = async function(ctx) {
  const databaseId = ctx.params.instanceId;
  const db = new CouchDB(databaseId)
  ctx.body = await db.destroy(ctx.params.recordId, ctx.params.revId);
};
