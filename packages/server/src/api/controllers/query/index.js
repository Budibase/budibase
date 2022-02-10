const {
  generateQueryID,
  getQueryParams,
  isProdAppID,
} = require("../../../db/utils")
const { BaseQueryVerbs } = require("../../../constants")
const { Thread, ThreadType } = require("../../../threads")
const { save: saveDatasource } = require("../datasource")
const { RestImporter } = require("./import")
const { invalidateDynamicVariables } = require("../../../threads/utils")
const environment = require("../../../environment")
const { getAppDB } = require("@budibase/backend-core/context")

const Runner = new Thread(ThreadType.QUERY, {
  timeoutMs: environment.QUERY_THREAD_TIMEOUT || 10000,
})

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
  const db = getAppDB()

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

  const importResult = await importer.importQueries(datasourceId)

  ctx.body = {
    ...importResult,
    datasourceId,
  }
  ctx.status = 200
}

exports.save = async function (ctx) {
  const db = getAppDB()
  const query = ctx.request.body

  if (!query._id) {
    query._id = generateQueryID(query.datasourceId)
  }

  const response = await db.put(query)
  query._rev = response.rev

  ctx.body = query
  ctx.message = `Query ${query.name} saved successfully.`
}

exports.find = async function (ctx) {
  const db = getAppDB()
  const query = enrichQueries(await db.get(ctx.params.queryId))
  // remove properties that could be dangerous in real app
  if (isProdAppID(ctx.appId)) {
    delete query.fields
    delete query.parameters
  }
  ctx.body = query
}

exports.preview = async function (ctx) {
  const db = getAppDB()

  const datasource = await db.get(ctx.request.body.datasourceId)
  // preview may not have a queryId as it hasn't been saved, but if it does
  // this stops dynamic variables from calling the same query
  const { fields, parameters, queryVerb, transformer, queryId } =
    ctx.request.body

  try {
    const { rows, keys, info, extra } = await Runner.run({
      appId: ctx.appId,
      datasource,
      queryVerb,
      fields,
      parameters,
      transformer,
      queryId,
    })

    ctx.body = {
      rows,
      schemaFields: [...new Set(keys)],
      info,
      extra,
    }
  } catch (err) {
    ctx.throw(400, err)
  }
}

async function execute(ctx, opts = { rowsOnly: false }) {
  const db = getAppDB()

  const query = await db.get(ctx.params.queryId)
  const datasource = await db.get(query.datasourceId)

  const enrichedParameters = ctx.request.body.parameters || {}
  // make sure parameters are fully enriched with defaults
  if (query && query.parameters) {
    for (let parameter of query.parameters) {
      if (!enrichedParameters[parameter.name]) {
        enrichedParameters[parameter.name] = parameter.default
      }
    }
  }

  // call the relevant CRUD method on the integration class
  try {
    const { rows, pagination, extra } = await Runner.run({
      appId: ctx.appId,
      datasource,
      queryVerb: query.queryVerb,
      fields: query.fields,
      pagination: ctx.request.body.pagination,
      parameters: enrichedParameters,
      transformer: query.transformer,
      queryId: ctx.params.queryId,
    })
    if (opts && opts.rowsOnly) {
      ctx.body = rows
    } else {
      ctx.body = { data: rows, pagination, ...extra }
    }
  } catch (err) {
    ctx.throw(400, err)
  }
}

exports.executeV1 = async function (ctx) {
  return execute(ctx, { rowsOnly: true })
}

exports.executeV2 = async function (ctx) {
  return execute(ctx, { rowsOnly: false })
}

const removeDynamicVariables = async queryId => {
  const db = getAppDB()
  const query = await db.get(queryId)
  const datasource = await db.get(query.datasourceId)
  const dynamicVariables = datasource.config.dynamicVariables

  if (dynamicVariables) {
    // delete dynamic variables from the datasource
    datasource.config.dynamicVariables = dynamicVariables.filter(
      dv => dv.queryId !== queryId
    )
    await db.put(datasource)

    // invalidate the deleted variables
    const variablesToDelete = dynamicVariables.filter(
      dv => dv.queryId === queryId
    )
    await invalidateDynamicVariables(variablesToDelete)
  }
}

exports.destroy = async function (ctx) {
  const db = getAppDB()
  await removeDynamicVariables(ctx.params.queryId)
  await db.remove(ctx.params.queryId, ctx.params.revId)
  ctx.message = `Query deleted.`
  ctx.status = 200
}
