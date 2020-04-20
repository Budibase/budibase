const couchdb = require("../../db");

exports.fetch = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId);
  const body = await db.view("database", "by_type", { 
    include_docs: true,
    key: ["model"] 
  });
  ctx.body = body.rows.map(row => row.doc);
}

exports.create = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId);
  const newModel = await db.insert({ 
    type: "model",
    ...ctx.request.body
  });

  const designDoc = await db.get("_design/database");
  designDoc.views = {
    ...designDoc.views,
    [`all_${newModel.id}`]: {
      map: `function(doc) {
        if (doc.modelId === "${newModel.id}") {
          emit(doc[doc.key], doc._id); 
        }
      }`
    }
  };
  await db.insert(designDoc, designDoc._id);

  ctx.body = {
    message: `Model ${ctx.request.body.name} created successfully.`,
    status: 200,
    model: {
      _id: newModel.id,
      _rev: newModel.rev,
      ...ctx.request.body
    } 
  }
}

exports.update = async function(ctx) {
}

exports.destroy = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId)

  const model = await db.destroy(ctx.params.modelId, ctx.params.revId);
  const modelViewId = `all_${model.id}`

  // Delete all records for that model
  const records = await db.view("database", modelViewId);
  await db.bulk({ 
    docs: records.rows.map(record => ({ id: record.id, _deleted: true })) 
  });

  // delete the "all" view
  const designDoc = await db.get("_design/database");
  delete designDoc.views[modelViewId];
  await db.insert(designDoc, designDoc._id);

  ctx.body = {
    message: `Model ${model.id} deleted.`,
    status: 200
  }
}
