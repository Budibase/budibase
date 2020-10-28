const fs = require("fs")
const CouchDB = require("../../db")
const { createLinkView } = require("../../db/linkedRows")
const { join } = require("../../utilities/centralPath")
const { downloadTemplate } = require("../../utilities/templates")
const { generateAppID } = require("../../db/utils")

exports.create = async function(ctx) {
  const instanceName = ctx.request.body.name
  const template = ctx.request.body.template
  const instanceId = generateAppID()

  const db = new CouchDB(instanceId)
  await db.put({
    _id: "_design/database",
    // view collation information, read before writing any complex views:
    // https://docs.couchdb.org/en/master/ddocs/views/collation.html#collation-specification
    views: {},
  })
  // add view for linked rows
  await createLinkView(instanceId)

  // replicate the template data to the instance DB
  if (template) {
    const templatePath = await downloadTemplate(...template.key.split("/"))
    const dbDumpReadStream = fs.createReadStream(
      join(templatePath, "db", "dump.txt")
    )
    const { ok } = await db.load(dbDumpReadStream)
    if (!ok) {
      ctx.throw(500, "Error loading database dump from template.")
    }
  }

  ctx.status = 200
  ctx.message = `Instance Database ${instanceName} successfully provisioned.`
  ctx.body = { _id: instanceId, name: instanceName }
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  await db.destroy()

  ctx.status = 200
  ctx.message = `Instance Database ${ctx.params.instanceId} successfully destroyed.`
}
