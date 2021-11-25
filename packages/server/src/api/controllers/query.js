const { processString } = require("@budibase/string-templates")
const CouchDB = require("../../db")
const { generateQueryID, getQueryParams } = require("../../db/utils")
const { BaseQueryVerbs } = require("../../constants")
const env = require("../../environment")
const { Thread, ThreadType } = require("../../threads")

const fetch = require("node-fetch")
const Joi = require("joi")
const { save: saveDatasource } = require("./datasource")

const Runner = new Thread(ThreadType.QUERY, { timeoutMs: 10000 })

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

exports.fetch = async function (ctx) {
  const db = new CouchDB(ctx.appId)

  const body = await db.allDocs(
    getQueryParams(null, {
      include_docs: true,
    })
  )
  ctx.body = enrichQueries(body.rows.map(row => row.doc))
}

// const query = {
//   datasourceId: "datasource_b9a474302a174d1295e4c273cd72bde9",
//   name: "available pets (import)",
//   parameters: [],
//   fields: {
//     headers: {},
//     queryString: "status=available",
//     path: "v2/pet/findByStatus",
//   },
//   queryVerb: "read",
//   transformer: "return data",
//   schema: {},
//   readable: true
// }

function generateQueryValidation() {
  // prettier-ignore
  return Joi.object({
    _id: Joi.string(),
    _rev: Joi.string(),
    name: Joi.string().required(),
    fields: Joi.object().required(),
    datasourceId: Joi.string().required(),
    readable: Joi.boolean(),
    parameters: Joi.array().items(Joi.object({
      name: Joi.string(),
      default: Joi.string().allow(""),
    })),
    queryVerb: Joi.string().allow().required(),
    extra: Joi.object().optional(),
    schema: Joi.object({}).required().unknown(true),
    transformer: Joi.string().optional(),
  })
}

const verbs = {
  get: "read",
  post: "create",
  put: "update",
  patch: "patch",
  delete: "delete",
}

const constructQuery = (datasource, swagger, path, method, config) => {
  const query = {
    datasourceId: datasource._id,
  }
  query.name = config.operationId || path
  query.parameters = []
  query.fields = {
    headers: {},
    // queryString: "status=available",
    path: path,
  }
  query.transformer = "return data"
  query.schema = {}
  query.readable = true
  query.queryVerb = verbs[method]

  return query
}

// {
//   "type": "url",
//   "data": "www.url.com/swagger.json"
// }

exports.import = async function (ctx) {
  const importConfig = ctx.request.body

  let data

  if (importConfig.type === "url") {
    data = await fetch(importConfig.data).then(res => res.json())
  } else if (importConfig.type === "raw") {
    data = JSON.parse(importConfig.data)
  }

  const db = new CouchDB(ctx.appId)
  const schema = generateQueryValidation()

  // create datasource
  const scheme = data.schemes.includes("https") ? "https" : "http"
  const url = `${scheme}://${data.host}${data.basePath}`
  const name = data.info.title

  // TODO: Refactor datasource creation into shared function
  const datasourceCtx = {
    ...ctx,
  }
  datasourceCtx.request.body.datasource = {
    type: "datasource",
    source: "REST",
    config: {
      url: url,
      defaultHeaders: {},
    },
    name: name,
  }
  await saveDatasource(datasourceCtx)
  const datasource = datasourceCtx.body.datasource

  // create query

  for (const [path, method] of Object.entries(data.paths)) {
    for (const [methodName, config] of Object.entries(method)) {
      const query = constructQuery(datasource, data, path, methodName, config)

      // validate query
      const { error } = schema.validate(query)
      if (error) {
        ctx.throw(400, `Invalid - ${error.message}`)
        return
      }

      // persist query
      query._id = generateQueryID(query.datasourceId)
      await db.put(query)
    }
  }

  // return the datasource
  ctx.body = { datasource }
  ctx.status = 200
}

exports.save = async function (ctx) {
  const db = new CouchDB(ctx.appId)
  const query = ctx.request.body

  if (!query._id) {
    query._id = generateQueryID(query.datasourceId)
  }

  const response = await db.put(query)
  query._rev = response.rev

  ctx.body = query
  ctx.message = `Query ${query.name} saved successfully.`
}

async function enrichQueryFields(fields, parameters = {}) {
  const enrichedQuery = {}

  // enrich the fields with dynamic parameters
  for (let key of Object.keys(fields)) {
    if (fields[key] == null) {
      continue
    }
    if (typeof fields[key] === "object") {
      // enrich nested fields object
      enrichedQuery[key] = await enrichQueryFields(fields[key], parameters)
    } else if (typeof fields[key] === "string") {
      // enrich string value as normal
      enrichedQuery[key] = await processString(fields[key], parameters, {
        noHelpers: true,
      })
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

exports.find = async function (ctx) {
  const db = new CouchDB(ctx.appId)
  const query = enrichQueries(await db.get(ctx.params.queryId))
  // remove properties that could be dangerous in real app
  if (env.isProd()) {
    delete query.fields
    delete query.parameters
    delete query.schema
  }
  ctx.body = query
}

exports.preview = async function (ctx) {
  const db = new CouchDB(ctx.appId)

  const datasource = await db.get(ctx.request.body.datasourceId)

  const { fields, parameters, queryVerb, transformer } = ctx.request.body
  const enrichedQuery = await enrichQueryFields(fields, parameters)

  try {
    const { rows, keys } = await Runner.run({
      datasource,
      queryVerb,
      query: enrichedQuery,
      transformer,
    })

    ctx.body = {
      rows,
      schemaFields: [...new Set(keys)],
    }
  } catch (err) {
    ctx.throw(400, err)
  }
}

exports.execute = async function (ctx) {
  const db = new CouchDB(ctx.appId)

  const query = await db.get(ctx.params.queryId)
  const datasource = await db.get(query.datasourceId)

  const enrichedQuery = await enrichQueryFields(
    query.fields,
    ctx.request.body.parameters
  )

  // call the relevant CRUD method on the integration class
  try {
    const { rows } = await Runner.run({
      datasource,
      queryVerb: query.queryVerb,
      query: enrichedQuery,
      transformer: query.transformer,
    })
    ctx.body = rows
  } catch (err) {
    ctx.throw(400, err)
  }
}

exports.destroy = async function (ctx) {
  const db = new CouchDB(ctx.appId)
  await db.remove(ctx.params.queryId, ctx.params.revId)
  ctx.message = `Query deleted.`
  ctx.status = 200
}
