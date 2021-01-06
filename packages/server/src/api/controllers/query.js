const handlebars = require("handlebars")
const Joi = require("joi")
const CouchDB = require("../../db")
const bcrypt = require("../../utilities/bcrypt")
const { generateQueryID, getQueryParams } = require("../../db/utils")
const { integrations } = require("../../integrations")
const joiValidator = require("../../middleware/joi-validator")

function generateQueryValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    name: Joi.string().required(),
    queryString: Joi.string().required(),
    datasourceId: Joi.string().required(),
    queryType: Joi.string().required(),
    schema: Joi.object({}).required().unknown(true)
  }))
}

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

  //
  // {
  //   type: "",
  //   query: "",
  //   otherStuff: ""
  // }

  if (!query._id) {
    query._id = generateQueryID(query.datasourceId)
  }

  const response = await db.put(query)
  query._rev = response.rev

  ctx.body = query
  ctx.message = `Query ${query.name} saved successfully.`
}

exports.preview = async function(ctx) {
  const { query, datasourceId } = ctx.request.body

  const db = new CouchDB(ctx.user.appId)

  const datasource = await db.get(datasourceId)

  const Integration = integrations[datasource.source]

  if (!Integration) {
    ctx.throw(400, "Integration type does not exist.")
    return
  }

  ctx.body = await new Integration(datasource.config, query).query()
}

exports.execute = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)

  const datasource = await db.get(ctx.params.datasourceId)

  const query = datasource.queries[ctx.params.queryId]

  const Integration = integrations[datasource.source]

  if (!Integration) {
    ctx.throw(400, "Integration type does not exist.")
    return
  }

  // TODO: allow the ability to POST parameters down when executing the query
  // const customParams = ctx.request.body
  const queryTemplate = handlebars.compile(query.queryString)

  const response = await new Integration(
    datasource.config,
    queryTemplate({
      // pass the params here from the UI and backend contexts
    })
  ).query()

  ctx.body = response
}

exports.fetchQuery = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)

  const query = await db.get(ctx.params.queryId)

  const datasource = await db.get(query.datasourceId)

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

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  await db.destroy(ctx.params.queryId)
  ctx.message = `Query deleted.`
  ctx.status = 200
}
