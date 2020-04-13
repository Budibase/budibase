const couchdb = require("../../db");

const MODEL_SCHEMA = {
  id: "foo",
  name: "Contact",
  key: "wutwut",
  fields: [
    {
      name: "name",
      type: "string",
      constraints: {
        min: "",
        max: ""
      }
    },
    {
      name: "age",
      type: "number",
      constraints: {
        min: 0,
        max: 100
      }
    }
  ],
  validationRules: [
  ]
}

exports.fetch = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId);
  const body = await db.view("database", "by_type", { 
    include_docs: true,
    key: ["model"] 
  });
  ctx.body = body.rows;
}

exports.create = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId);
  const newModel = await db.insert(ctx.request.body);
  const designDoc = await db.get("_design/database");
  designDoc.views = {
    ...designDoc.views,
    [`all_${newModel.id}`]: {
      map: function(doc) {
        emit([doc.modelId], doc._id); 
      }
    }
  };

  await db.insert(designDoc, designDoc._id);
  ctx.body = {
    ...newModel,
    message: `Model ${ctx.request.body.name} created successfully.`,
    status: 200,
  }
}

exports.update = async function(ctx) {
}

exports.destroy = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId)
  const model = await db.destroy(ctx.params.modelId, ctx.params.revId);
  ctx.body = {
    message: `Model ${model.id} deleted.`,
    status: 200
  }
}
