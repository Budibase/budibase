const CouchDB = require("../../db")
const ClientDb = require("../../db/clientDb")
const { getPackageForBuilder } = require("../../utilities/builder")
const newid = require("../../db/newid")
const env = require("../../environment")

exports.fetch = async function(ctx) {
  const db = new CouchDB(ClientDb.name(env.CLIENT_ID))
  const body = await db.query("client/by_type", {
    include_docs: true,
    key: ["app"],
  })

  ctx.body = body.rows.map(row => row.doc)
}

exports.fetchAppPackage = async function(ctx) {
  const db = new CouchDB(ClientDb.name(env.CLIENT_ID))
  const application = await db.get(ctx.params.applicationId)
  ctx.body = await getPackageForBuilder(ctx.config, application)
}

exports.create = async function(ctx) {
  const db = new CouchDB(ClientDb.name(env.CLIENT_ID))

  const newApplication = {
    _id: newid(),
    type: "app",
    instances: [],
    userInstanceMap: {},
    componentLibraries: [
      "@budibase/standard-components",
      "@budibase/materialdesign-components",
    ],
    ...ctx.request.body,
  }

  const { rev } = await db.post(newApplication)
  newApplication._rev = rev

  ctx.body = newApplication
  ctx.message = `Application ${ctx.request.body.name} created successfully`
}
