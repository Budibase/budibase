const { processString } = require("@budibase/string-templates")
const CouchDB = require("../../db")
const { generateQueryID, getQueryParams } = require("../../db/utils")
const { integrations } = require("../../integrations")
const { BaseQueryVerbs } = require("../../constants")
const env = require("../../environment")

// simple function to append "readable" to all read queries
function enrichQueries(input) {
  const wasArray = Array.isArray(input)
  const queries = wasArray ? input : [input]
  for (let query of queries) {
    if (query.queryVerb === BaseQueryVerbs.READ) {
      query.readable = true
    }
  }
  return wasArray ? queries : queries[0]
}

function formatResponse(resp) {
  if (typeof resp === "string") {
    resp = JSON.parse(resp)
  }
  if (!Array.isArray(resp)) {
    resp = [resp]
  }
  return resp
}

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)

  const body = await db.allDocs(
    getQueryParams(null, {
      include_docs: true,
    })
  )
  ctx.body = enrichQueries(body.rows.map(row => row.doc))
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

async function enrichQueryFields(fields, parameters) {
  const enrichedQuery = {}

  // enrich the fields with dynamic parameters
  for (let key of Object.keys(fields)) {
    if (typeof fields[key] === "object") {
      // enrich nested fields object
      enrichedQuery[key] = await enrichQueryFields(fields[key], parameters)
    } else if (typeof fields[key] === "string") {
      // enrich string value as normal
      enrichedQuery[key] = await processString(fields[key], parameters)
    } else {
      enrichedQuery[key] = fields[key]
    }
  }

  if (
    enrichedQuery.json ||
    enrichedQuery.customData ||
    enrichedQuery.requestBody
  ) {
    try {
      enrichedQuery.json = JSON.parse(
        enrichedQuery.json ||
          enrichedQuery.customData ||
          enrichedQuery.requestBody
      )
    } catch (err) {
      throw { message: `JSON Invalid - error: ${err}` }
    }
    delete enrichedQuery.customData
  }

  return enrichedQuery
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const query = enrichQueries(await db.get(ctx.params.queryId))
  // remove properties that could be dangerous in real app
  if (env.isProd()) {
    delete query.fields
    delete query.parameters
    delete query.schema
  }
  ctx.body = query
}

exports.preview = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)

  const datasource = await db.get(ctx.request.body.datasourceId)

  const Integration = integrations[datasource.source]

  if (!Integration) {
    ctx.throw(400, "Integration type does not exist.")
  }

  const { fields, parameters, queryVerb } = ctx.request.body

  const enrichedQuery = await enrichQueryFields(fields, parameters)

  const rows = formatResponse(
    await new Integration(datasource.config)[queryVerb](enrichedQuery)
  )

  // get all the potential fields in the schema
  const keys = rows.flatMap(Object.keys)

  ctx.body = {
    rows,
    schemaFields: [...new Set(keys)],
  }
}

exports.execute = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)

  const query = await db.get(ctx.params.queryId)
  const datasource = await db.get(query.datasourceId)

  const Integration = integrations[datasource.source]

  if (!Integration) {
    ctx.throw(400, "Integration type does not exist.")
  }

  const enrichedQuery = await enrichQueryFields(
    query.fields,
    ctx.request.body.parameters
  )

  // call the relevant CRUD method on the integration class
  ctx.body = formatResponse(
    await new Integration(datasource.config)[query.queryVerb](enrichedQuery)
  )
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  await db.remove(ctx.params.queryId, ctx.params.revId)
  ctx.message = `Query deleted.`
  ctx.status = 200
}
