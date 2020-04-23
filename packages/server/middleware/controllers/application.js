const CouchDB = require("../../db");
const {
  getPackageForBuilder,
} = require("../../utilities/builder")

exports.fetch = async function(ctx) {
  const clientDb = new CouchDB(`client-${ctx.params.clientId}`);
  const body = await clientDb.query("client/by_type", { 
    include_docs: true,
    key: ["app"] 
  });

  ctx.body = body.rows.map(row => row.doc);
};

exports.fetchAppPackage = async function(ctx) {
  const clientDb = new CouchDB(`client-${ctx.params.clientId}`);
  const application = await clientDb.get(ctx.params.applicationId);
  ctx.body = await getPackageForBuilder(ctx.config, application);
}

exports.create = async function(ctx) {
  const clientDb = new CouchDB(`client-${ctx.params.clientId}`);
  const { id, rev } = await clientDb.post({
    type: "app",
    instances: [],
    ...ctx.request.body,
  });

  ctx.body = {
    id,
    rev,
    message: `Application ${ctx.request.body.name} created successfully`
  }
};