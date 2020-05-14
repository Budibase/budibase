const CouchDB = require("../../db")
const { getPackageForBuilder } = require("../../utilities/builder")
const uuid = require("uuid")
const env = require("../../environment")

exports.fetch = async function(ctx) {
  const clientDb = new CouchDB(`client-${env.CLIENT_ID}`)
  const body = await clientDb.query("client/by_type", {
    include_docs: true,
    key: ["app"],
  })

  ctx.body = body.rows.map(row => row.doc)
}

exports.fetchAppPackage = async function(ctx) {
  const clientDb = new CouchDB(`client-${env.CLIENT_ID}`)
  const application = await clientDb.get(ctx.params.applicationId)
  ctx.body = await getPackageForBuilder(ctx.config, application)
}

exports.create = async function(ctx) {
  const clientDb = new CouchDB(`client-${env.CLIENT_ID}`)

  const newApplication = {
    _id: uuid.v4().replace(/-/g, ""),
    type: "app",
    instances: [],
    userInstanceMap: {},
    componentLibraries: [
      "@budibase/standard-components",
      "@budibase/materialdesign-components",
    ],
    ...ctx.request.body,
  }

  const { rev } = await clientDb.post(newApplication)
  newApplication._rev = rev
  ctx.body = newApplication
  ctx.message = `Application ${ctx.request.body.name} created successfully`
}
