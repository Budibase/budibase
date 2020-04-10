const couchdb = require("../../db");

exports.create = async function(ctx) {
  const clientId =  `client-${ctx.request.body.clientId}`;
  await couchdb.db.create(clientId);

  await couchdb.db.use(clientId).insert({
    views: { 
      by_type: { 
        map: function(doc) { 
          emit([doc.type], doc._id); 
        } 
      } 
    }
  }, '_design/client');
  ctx.body = {
    message: `Client Database ${clientId} successfully provisioned.`
  }
};

exports.destroy = async function(ctx) {
  const dbId = `client-${ctx.params.clientId}`;
  await couchdb.db.destroy(dbId);
  ctx.body = {
    status: 200,
    message: `Client Database ${dbId} successfully deleted.`
  }
};