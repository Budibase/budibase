const CouchDB = require("../../../db")
const CLIENT_DB_ID = "client-testing"
const TEST_APP_ID = "test-app"

exports.createModel = async (instanceId, model) => {
  model = model || {
    name: "TestModel",
    type: "model",
    key: "name",
    schema: {
      name: { type: "string" },
    },
  }
  const db = new CouchDB(instanceId)
  const response = await db.post(model)

  const designDoc = await db.get("_design/database")
  designDoc.views = {
    ...designDoc.views,
    [`all_${response.id}`]: {
      map: `function(doc) {
        if (doc.modelId === "${response.id}") {
          emit(doc[doc.key], doc._id); 
        }
      }`,
    },
  }
  await db.put(designDoc)

  return {
    ...response,
    ...model,
  }
}

exports.createClientDatabase = async () => {
  const db = new CouchDB(CLIENT_DB_ID)

  await db.put({
    _id: "_design/client",
    views: {
      by_type: {
        map: function(doc) {
          emit([doc.type], doc._id)
        },
      }.toString(),
    },
  })

  await db.put({
    _id: TEST_APP_ID,
    type: "app",
    instances: [],
  })

  return db
}

exports.destroyClientDatabase = async () => new CouchDB(CLIENT_DB_ID).destroy()

exports.createInstanceDatabase = async instanceId => {
  const db = new CouchDB(instanceId)

  await db.put({
    _id: "_design/database",
    metadata: {
      clientId: CLIENT_DB_ID,
      applicationId: TEST_APP_ID,
    },
    views: {
      by_type: {
        map: function(doc) {
          emit([doc.type], doc._id)
        }.toString(),
      },
    },
  })

  return db
}

exports.insertDocument = async (databaseId, document) => {
  const { id, ...documentFields } = document
  await new CouchDB(databaseId).put({ _id: id, ...documentFields })
}

exports.createSchema = async (request, instanceId, schema) => {
  for (let model of schema.models) {
    await request.post(`/api/${instanceId}/models`).send(model)
  }
  for (let view of schema.views) {
    await request.post(`/api/${instanceId}/views`).send(view)
  }
}
