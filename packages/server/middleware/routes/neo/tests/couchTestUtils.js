const couchdb = require("../../../../db");

const CLIENT_DB_ID = "client-testing";

exports.destroyDatabase = couchdb.db.destroy;

exports.createModel = async instanceId => {
  const model = {
    "name": "TestModel",
    "type": "model",
    "key": "name",
    "fields": [
        {
          "name": "name",
          "type": "string"
        }
    ]
  }
  const db = couchdb.db.use(instanceId);
  const response = await db.insert(model);

  const designDoc = await db.get("_design/database");
  designDoc.views = {
    ...designDoc.views,
    [`all_${response.id}`]: {
      map: function(doc) {
        emit([doc.modelId], doc._id); 
      }
    }
  };
  await db.insert(designDoc, designDoc._id);

  return {
    ...response,
    ...model
  };
} 

exports.createClientDatabase = async () => {
  await couchdb.db.create(CLIENT_DB_ID);

  await couchdb.db.use(CLIENT_DB_ID).insert({
    views: { 
      by_type: { 
        map: function(doc) { 
          emit([doc.type], doc._id); 
        } 
      } 
    }
  }, '_design/client');
}

exports.createInstanceDatabase = async instanceId => {
  await couchdb.db.create(instanceId);

  await couchdb.db.use(instanceId).insert({
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