const couchdb = require("../../../../db")({ database: "couch" })
const createClientDb = require("../../../../db/createClientDb")
const CLIENT_DB_ID = "client-testing";
const TEST_APP_ID = "test-app";

exports.destroyDatabase = couchdb.db.destroy;

exports.createModel = async (instanceId, model) => {
  model = model || {
    "name": "TestModel",
    "type": "model",
    "key": "name",
    "schema": {
      "name": { "type": "string" }
    }
  }
  const db = couchdb.db.use(instanceId);
  const response = await db.insert(model);

  const designDoc = await db.get("_design/database");
  designDoc.views = {
    ...designDoc.views,
    [`all_${response.id}`]: {
      map: `function(doc) {
        if (doc.modelId === "${response.id}") {
          emit(doc[doc.key], doc._id); 
        }
      }`
    }
  };
  await db.insert(designDoc, designDoc._id);

  return {
    ...response,
    ...model
  };
} 

exports.createClientDatabase = async () =>
  await createClientDb(CLIENT_DB_ID)

exports.destroyClientDatabase = async () => await couchdb.db.destroy(CLIENT_DB_ID);

exports.createInstanceDatabase = async instanceId => {
  await couchdb.db.create(instanceId);

  const db = couchdb.db.use(instanceId);

  await db.insert({
    metadata: {
      clientId: CLIENT_DB_ID,
      applicationId: TEST_APP_ID
    },
    views: { 
      by_type: { 
        map: function(doc) { 
          emit([doc.type], doc._id); 
        } 
      } 
    }
  }, '_design/database');

  return instanceId;
}

exports.insertDocument = async (databaseId, document) => {
  const { id, ...documentFields } = document;
  await couchdb.db.use(databaseId).insert(documentFields, id);
}

exports.createSchema = async (request, instanceId, schema) => {
  for (let model of schema.models) {
    await request.post(`/api/${instanceId}/models`).send(model)
  }
  for (let view of schema.views) {
    await request.post(`/api/${instanceId}/views`).send(view)
  }
}
