const CouchDB = require("../../db")
const bcrypt = require("../../utilities/bcrypt")
const {
  generateDatasourceID,
  getDatasourceParams,
  getQueryParams,
} = require("../../db/utils")

exports.fetch = async function(ctx) {
  const database = new CouchDB(ctx.user.appId)
  const datasources = (
    await database.allDocs(
      getDatasourceParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
  ctx.body = datasources
}

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)

  const datasource = {
    _id: generateDatasourceID(),
    type: "datasource",
    ...ctx.request.body,
  }

  try {
    const response = await db.post(datasource)
    datasource._rev = response.rev

    ctx.status = 200
    ctx.message = "Datasource created successfully."
    ctx.body = datasource
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

exports.update = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const user = ctx.request.body
  const dbUser = await db.get(ctx.request.body._id)
  if (user.password) {
    user.password = await bcrypt.hash(user.password)
  } else {
    delete user.password
  }
  const newData = { ...dbUser, ...user }

  const response = await db.put(newData)
  user._rev = response.rev

  ctx.status = 200
  ctx.message = `User ${ctx.request.body.email} updated successfully.`
  ctx.body = response
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)

  // Delete all queries for the datasource
  const rows = await db.allDocs(getQueryParams(ctx.params.datasourceId, null))
  await db.bulkDocs(rows.rows.map(row => ({ ...row.doc, _deleted: true })))

  // delete the datasource
  await db.destroy(ctx.params.datasourceId)

  ctx.message = `Datasource deleted.`
  ctx.status = 200
}

exports.find = async function(ctx) {
  const database = new CouchDB(ctx.user.appId)
  const datasource = await database.get(ctx.params.datasourceId)
  ctx.body = datasource
}
