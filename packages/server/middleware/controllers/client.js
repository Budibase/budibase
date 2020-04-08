const couchdb = require("../../db");

const controller = {
  create: async ctx => {
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
  },
  destroy: async ctx => {
    const databaseId = ctx.params.databaseId;
    const database = couchdb.db.use(databaseId)
    ctx.body = await database.destroy(ctx.params.recordId);
  },
}

module.exports = controller;