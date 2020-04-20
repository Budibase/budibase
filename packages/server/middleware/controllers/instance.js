const couchdb = require("../../db");

exports.create = async function(ctx) {
  const instanceName = ctx.request.body.name;
  await couchdb.db.create(instanceName);

  const { clientId, applicationId } = ctx.params;
  await couchdb.db.use(instanceName).insert({
    metadata: {
      clientId,
      applicationId
    },
    views: { 
      by_type: { 
        map: function(doc) { 
          emit([doc.type], doc._id); 
        } 
      } 
    }
  }, '_design/database');

  // Add the new instance under the app clientDB
  const clientDatabaseId = `client-${clientId}`
  const clientDb = await couchdb.db.use(clientDatabaseId);
  const budibaseApp = await clientDb.get(applicationId);
  budibaseApp.instances.push({
    id: instanceName,
    name: instanceName
  });
  await clientDb.insert(budibaseApp, budibaseApp._id);

  ctx.body = {
    message: `Instance Database ${instanceName} successfully provisioned.`,
    status: 200
  }
};

exports.destroy = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId);
  const designDoc = await db.get("_design/database");
  await couchdb.db.destroy(ctx.params.instanceId)

  // remove instance from client application document
  const { metadata } = designDoc;
  const clientDb = await couchdb.db.use(metadata.clientId);
  const budibaseApp = await clientDb.get(metadata.applicationId);
  budibaseApp.instances = budibaseApp.instances.filter(instance => instance !== ctx.params.instanceId);
  await clientDb.insert(budibaseApp, budibaseApp._id);

  ctx.body = {
    message: `Instance Database ${ctx.params.instanceId} successfully destroyed.`,
    status: 200
  }
};