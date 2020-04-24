const CouchDB = require("../../db");

exports.create = async function(ctx) {
  const instanceName = ctx.request.body.name;
  // await couchdb.db.create(instanceName);

  const { clientId, applicationId } = ctx.params;
  const db = new CouchDB(ctx.config)(instanceName);
  await db.put({
    _id: "_design/database",
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
  });

  // Add the new instance under the app clientDB
  const clientDatabaseId = `client-${clientId}`
  const clientDb = new CouchDB(ctx.config)(clientDatabaseId);
  const budibaseApp = await clientDb.get(applicationId);
  const instance = { id: instanceName, name: instanceName };
  budibaseApp.instances.push(instance);
  await clientDb.put(budibaseApp);

  ctx.body = {
    message: `Instance Database ${instanceName} successfully provisioned.`,
    status: 200,
    instance
  }
};

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.config)(ctx.params.instanceId);
  const designDoc = await db.get("_design/database");
  await db.destroy();

  // remove instance from client application document
  const { metadata } = designDoc;
  const clientDb = new CouchDB(ctx.config)(metadata.clientId);
  const budibaseApp = await clientDb.get(metadata.applicationId);
  budibaseApp.instances = budibaseApp.instances.filter(instance => instance !== ctx.params.instanceId);
  await clientDb.put(budibaseApp);

  ctx.body = {
    message: `Instance Database ${ctx.params.instanceId} successfully destroyed.`,
    status: 200
  }
};