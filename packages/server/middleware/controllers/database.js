const couchdb = require("../../db");

exports.create = async function(ctx) {
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
    message: `Instance Database ${databaseName} successfully provisioned.`,
    status: 200
  }
};

exports.destroy = async function(ctx) {
  await couchdb.db.destroy(ctx.params.databaseId)
  ctx.body = {
    message: `Instance Database ${ctx.params.databaseId} successfully destroyed.`,
    status: 200
  }
};