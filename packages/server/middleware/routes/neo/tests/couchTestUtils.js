const couchdb = require("../../../../db");

const CLIENT_DB_ID = "client-testing";

exports.destroyDatabase = couchdb.db.destroy;

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
}

exports.insertDocument = async (databaseId, document) => {
  const { id, ...documentFields } = document;
  await couchdb.db.use(databaseId).insert(documentFields, id);
}