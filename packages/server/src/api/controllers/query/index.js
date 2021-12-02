const { processString } = require("@budibase/string-templates")
const CouchDB = require("../../../db")
const {
  generateQueryID,
  getQueryParams,
  isProdAppID,
} = require("../../../db/utils")
const { BaseQueryVerbs } = require("../../../constants")
const { Thread, ThreadType } = require("../../../threads")
const { save: saveDatasource } = require("../datasource")
const { RestImporter } = require("./import")

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

exports.import = async ctx => {
  const body = ctx.request.body
  const data = body.data

  const importer = new RestImporter(data)
  await importer.init()

  let datasourceId
  if (!body.datasourceId) {
    // construct new datasource
    const info = await importer.getInfo()
    let datasource = {
      type: "datasource",
      source: "REST",
      config: {
        url: info.url,
        defaultHeaders: [],
      },
      name: info.name,
    }
    // save the datasource
    const datasourceCtx = { ...ctx }
    datasourceCtx.request.body.datasource = datasource
    await saveDatasource(datasourceCtx)
    datasourceId = datasourceCtx.body.datasource._id
  } else {
    // use existing datasource
    datasourceId = body.datasourceId
  }

  const importResult = await importer.importQueries(ctx.appId, datasourceId)

  ctx.body = {
    ...importResult,
    datasourceId,
  }
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
  if (isProdAppID(ctx.appId)) {
    delete query.fields
    delete query.parameters
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
