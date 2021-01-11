const handlebars = require("handlebars")
const CouchDB = require("../../db")
const { generateQueryID, getQueryParams } = require("../../db/utils")
const { integrations } = require("../../integrations")

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)

  const body = await db.allDocs(
    getQueryParams(null, {
      include_docs: true,
    })
  )
  ctx.body = body.rows.map(row => row.doc)
}

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const query = ctx.request.body

  if (!query._id) {
    query._id = generateQueryID(query.datasourceId)
  }

  const response = await db.put(query)
  query._rev = response.rev

  ctx.body = query
  ctx.message = `Query ${query.name} saved successfully.`
}

exports.preview = async function(ctx) {
  const { query, datasourceId, parameters } = ctx.request.body

  let parsedQuery = ""
  if (query) {
    const queryTemplate = handlebars.compile(query)
    parsedQuery = queryTemplate(parameters)
  }

  const db = new CouchDB(ctx.user.appId)

  const datasource = await db.get(datasourceId)

  const Integration = integrations[datasource.source]

  if (!Integration) {
    ctx.throw(400, "Integration type does not exist.")
    return
  }

  ctx.body = await new Integration(datasource.config, parsedQuery).query()
}

exports.execute = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)

  const query = await db.get(ctx.params.queryId)
  const datasource = await db.get(query.datasourceId)

  const queryTemplate = handlebars.compile(query.queryString)

  // TODO: Take the default params into account
  const parsedQuery = queryTemplate(ctx.request.body.parameters)

  const Integration = integrations[datasource.source]

  if (!Integration) {
    ctx.throw(400, "Integration type does not exist.")
    return
  }
  const response = await new Integration(datasource.config, parsedQuery).query()

  ctx.body = response
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  await db.destroy(ctx.params.queryId)
  ctx.message = `Query deleted.`
  ctx.status = 200
}
