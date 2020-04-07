const couchdb = require("../../db");

const controller = {
  save: async ctx => {
  },
  fetch: async ctx => {
    const databaseId = ctx.params.databaseId;
    const instance = couchdb.db.use(databaseId)
    const documents = await instance.list({});

    ctx.status = 200;
    ctx.body = documents;
  },
  destroy: async ctx => {
  },
}

module.exports = controller;