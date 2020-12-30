const CouchDB = require("../../db")
const bcrypt = require("../../utilities/bcrypt")
const {
  generateDatasourceID,
  getDatasourceParams,
  generateQueryID,
} = require("../../db/utils")
const { integrations } = require("../../integrations")

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

  // TODO: validate the config against the integration type
  // if (!somethingIsntValid) {
  //   // ctx.throw(400, "email and Password Required.")
  // }

  const datasource = {
    _id: generateDatasourceID(),
    type: "datasource",
    queries: {},
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
  const database = new CouchDB(ctx.user.appId)
  await database.destroy(ctx.params.datasourceId)
  ctx.message = `Datasource deleted.`
  ctx.status = 200
}

exports.find = async function(ctx) {
  const database = new CouchDB(ctx.user.appId)
  const datasource = await database.get(ctx.params.datasourceId)
  ctx.body = datasource
}

exports.saveQuery = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const query = ctx.request.body

  //
  // {
  //   type: "",
  //   query: "",
  //   otherStuff: ""
  // }

  const datasource = await db.get(ctx.params.datasourceId)

  const queryId = generateQueryID()

  datasource.queries[queryId] = query

  const response = await db.put(datasource)
  datasource._rev = response.rev

  ctx.body = datasource
  ctx.message = `Query ${query.name} saved successfully.`
}

exports.previewQuery = async function(ctx) {
  const { type, config, query } = ctx.request.body

  const Integration = integrations[type]

  if (!Integration) {
    ctx.throw(400, "Integration type does not exist.")
    return
  }

  ctx.body = await new Integration(config, query).query()
}

exports.executeQuery = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)

  const datasource = await db.get(ctx.params.datasourceId)

  const query = datasource.queries[ctx.params.queryId]

  const Integration = integrations[datasource.source]

  if (!Integration) {
    ctx.throw(400, "Integration type does not exist.")
    return
  }

  const rows = await new Integration(
    datasource.config,
    query.queryString
  ).query()

  ctx.body = {
    schema: query.schema,
    rows,
  }
}
