const couchdb = require("../../db");

const controller = {
  fetch: async ctx => {

  },
  create: async ctx => {
    const databaseName =  ctx.request.body.name;
    await couchdb.db.create(databaseName);
    await couchdb.db.use(databaseName).insert({
      views: { 
        by_type: { 
          map: function(doc) { 
            emit([doc.type], doc._id); 
          } 
        } 
      }
    }, '_design/database');

    ctx.body = {
      message: `Database ${databaseName} successfully provisioned.`,
      status: 200
    }
  },
  destroy: async ctx => {
    ctx.body = await couchdb.db.destroy(ctx.params.databaseName)
  }
}

module.exports = controller;