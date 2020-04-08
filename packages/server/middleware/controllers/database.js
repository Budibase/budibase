const couchdb = require("../../db");

const controller = {
  fetch: async ctx => {

  },
  create: async ctx => {
    const databaseName =  ctx.request.body.databaseName;
    await couchdb.db.create(databaseName);
    const db = couchdb.db.use(databaseName)
    await db.insert({
      views: { 
        by_type: { 
          map: function(doc) { 
            emit([doc.type], doc._id); 
          } 
        } 
      }
    }, '_design/database');
    ctx.body = {
      message: `Database ${databaseName} successfully provisioned.`
    }
  },
  destroy: async ctx => {
    ctx.body = await couchdb.db.destroy(ctx.params.databaseName)
  }
}

module.exports = controller;