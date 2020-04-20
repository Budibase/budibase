const couchdb = require("../../db")
const {
  events,
  schemaValidator
} = require("@budibase/common")

exports.save = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId);
  const record = ctx.request.body;

  // validation with ajv
  const model = await db.get(ctx.params.modelId);
  const validate = schemaValidator.compile({ 
    properties: model.schema
  });
  const valid = validate(record);

  if (!valid) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      errors: validate.errors
    };
    return;
  }

  const existingRecord = record._id && await db.get(record._id);

  if (existingRecord) {
    const response = await db.insert(record, existingRecord._id)
    ctx.body = {
      message: "Record updated successfully.",
      status: 200,
      record: response
    }
    return;
  }

  const response = await db.insert({
    modelId: ctx.params.modelId,
    type: "record",
    ...record
  })

  // await ctx.publish(events.recordApi.save.onRecordCreated, {
  //   record: record,
  // })

  ctx.body = {
    message: "Record created successfully.",
    status: 200,
    record: response
  };
}

exports.fetch = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId)
  const response = await db.view(
    "database",
    ctx.params.viewName,
    {
      include_docs: true
    }
  )
  ctx.body = response.rows.map(row => row.doc);
}

exports.find = async function(ctx) {
  const db = couchdb.db.use(ctx.params.databaseId)

  const record = await db.get(ctx.params.recordId);

  ctx.body = record;
  ctx.status = 200;
}

exports.destroy = async function(ctx) {
  const databaseId = ctx.params.instanceId;
  const db = couchdb.db.use(databaseId)
  ctx.body = await db.destroy(ctx.params.recordId, ctx.params.revId);
};