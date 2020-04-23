const CouchDB = require("../../db");

exports.create = async function(ctx) {
  const clientId =  `client-${ctx.request.body.clientId}`;
  const db = new CouchDB(clientId);

  await db.put({
    _id: "_design/client",
    views: { 
      by_type: { 
        map: function(doc) { 
          emit([doc.type], doc._id); 
        } 
      } 
    }
  });

  ctx.body = {
    message: `Client Database ${clientId} successfully provisioned.`
  }
};

exports.destroy = async function(ctx) {
  const dbId = `client-${ctx.params.clientId}`;

  await new CouchDB(dbId).destroy();

  ctx.body = {
    status: 200,
    message: `Client Database ${dbId} successfully deleted.`
  }
};