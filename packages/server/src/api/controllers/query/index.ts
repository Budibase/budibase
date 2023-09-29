import { generateQueryID } from "../../../db/utils"
import { BaseQueryVerbs, FieldTypes } from "../../../constants"
import { Thread, ThreadType } from "../../../threads"
import { save as saveDatasource } from "../datasource"
import { RestImporter } from "./import"
import { invalidateDynamicVariables } from "../../../threads/utils"
import env from "../../../environment"
import { quotas } from "@budibase/pro"
import { events, context, utils, constants } from "@budibase/backend-core"
import sdk from "../../../sdk"
import { QueryEvent } from "../../../threads/definitions"
import { ConfigType, Query, UserCtx } from "@budibase/types"
import { ValidQueryNameRegex } from "@budibase/shared-core"

const Runner = new Thread(ThreadType.QUERY, {
  timeoutMs: env.QUERY_THREAD_TIMEOUT || 10000,
})

// simple function to append "readable" to all read queries
function enrichQueries(input: any) {
  const wasArray = Array.isArray(input)
  const queries = wasArray ? input : [input]
  for (let query of queries) {
    if (query.queryVerb === BaseQueryVerbs.READ) {
      query.readable = true
    }
  }
  return wasArray ? queries : queries[0]
}

export async function fetch(ctx: UserCtx) {
  ctx.body = await sdk.queries.fetch()
}

const _import = async (ctx: UserCtx) => {
  const body = ctx.request.body
  const data = body.data

  const importer = new RestImporter(data)
  await importer.init()

  let datasourceId
  if (!body.datasourceId) {
    // construct new datasource
    const info: any = await importer.getInfo()
    let datasource = {
      type: "datasource",
      source: "REST",
      config: {
        url: info.url,
        defaultHeaders: [],
        rejectUnauthorized: true,
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
export { _import as import }

export async function save(ctx: UserCtx) {
  const db = context.getAppDB()
  const query = ctx.request.body

  // Validate query name
  if (!query?.name.match(ValidQueryNameRegex)) {
    ctx.throw(400, "Invalid query name")
  }

  const datasource = await sdk.datasources.get(query.datasourceId)

  let eventFn
  if (!query._id) {
    query._id = generateQueryID(query.datasourceId)
    eventFn = () => events.query.created(datasource, query)
  } else {
    eventFn = () => events.query.updated(datasource, query)
  }

  const response = await db.put(query)
  await eventFn()
  query._rev = response.rev

  ctx.body = query
  ctx.message = `Query ${query.name} saved successfully.`
}

export async function find(ctx: UserCtx) {
  const queryId = ctx.params.queryId
  ctx.body = await sdk.queries.find(queryId)
}

//Required to discern between OIDC OAuth config entries
function getOAuthConfigCookieId(ctx: UserCtx) {
  if (ctx.user.providerType === ConfigType.OIDC) {
    return utils.getCookie(ctx, constants.Cookie.OIDC_CONFIG)
  }
}

function getAuthConfig(ctx: UserCtx) {
  const authCookie = utils.getCookie(ctx, constants.Cookie.Auth)
  let authConfigCtx: any = {}
  authConfigCtx["configId"] = getOAuthConfigCookieId(ctx)
  authConfigCtx["sessionId"] = authCookie ? authCookie.sessionId : null
  return authConfigCtx
}

export async function preview(ctx: UserCtx) {
  const { datasource, envVars } = await sdk.datasources.getWithEnvVars(
    ctx.request.body.datasourceId
  )
  const query = ctx.request.body
  // preview may not have a queryId as it hasn't been saved, but if it does
  // this stops dynamic variables from calling the same query
  const { fields, parameters, queryVerb, transformer, queryId, schema } = query

  let existingSchema = schema
  if (queryId && !existingSchema) {
    try {
      const db = context.getAppDB()
      const existing = (await db.get(queryId)) as Query
      existingSchema = existing.schema
    } catch (err: any) {
      if (err.status !== 404) {
        ctx.throw(500, "Unable to retrieve existing query")
      }
    }
  }

  const authConfigCtx: any = getAuthConfig(ctx)

  try {
    const inputs: QueryEvent = {
      appId: ctx.appId,
      datasource,
      queryVerb,
      fields,
      parameters,
      transformer,
      queryId,
      schema,
      // have to pass down to the thread runner - can't put into context now
      environmentVariables: envVars,
      ctx: {
        user: ctx.user,
        auth: { ...authConfigCtx },
      },
    }
    const runFn = () => Runner.run(inputs)

    const { rows, keys, info, extra } = await quotas.addQuery<any>(runFn, {
      datasourceId: datasource._id,
    })
    const schemaFields: any = {}
    if (rows?.length > 0) {
      for (let key of [...new Set(keys)] as string[]) {
        const field = rows[0][key]
        let type = typeof field,
          fieldType = FieldTypes.STRING
        if (field)
          switch (type) {
            case "boolean":
              schemaFields[key] = FieldTypes.BOOLEAN
              break
            case "object":
              if (field instanceof Date) {
                fieldType = FieldTypes.DATETIME
              } else if (Array.isArray(field)) {
                fieldType = FieldTypes.ARRAY
              } else {
                fieldType = FieldTypes.JSON
              }
              break
            case "number":
              fieldType = FieldTypes.NUMBER
              break
          }
        schemaFields[key] = fieldType
      }
    }
    // if existing schema, update to include any previous schema keys
    if (existingSchema) {
      for (let key of Object.keys(schemaFields)) {
        if (existingSchema[key]?.type) {
          schemaFields[key] = existingSchema[key].type
        }
      }
    }
    // remove configuration before sending event
    delete datasource.config
    await events.query.previewed(datasource, query)
    ctx.body = {
      rows,
      schemaFields,
      info,
      extra,
    }
  } catch (err: any) {
    ctx.throw(400, err)
  }
}

async function execute(
  ctx: UserCtx,
  opts: any = { rowsOnly: false, isAutomation: false }
) {
  const db = context.getAppDB()

  const query = await db.get<Query>(ctx.params.queryId)
  const { datasource, envVars } = await sdk.datasources.getWithEnvVars(
    query.datasourceId
  )

  let authConfigCtx: any = {}
  if (!opts.isAutomation) {
    authConfigCtx = getAuthConfig(ctx)
  }
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
    const inputs: QueryEvent = {
      appId: ctx.appId,
      datasource,
      queryVerb: query.queryVerb,
      fields: query.fields,
      pagination: ctx.request.body.pagination,
      parameters: enrichedParameters,
      transformer: query.transformer,
      queryId: ctx.params.queryId,
      // have to pass down to the thread runner - can't put into context now
      environmentVariables: envVars,
      ctx: {
        user: ctx.user,
        auth: { ...authConfigCtx },
      },
      schema: query.schema,
    }
    const runFn = () => Runner.run(inputs)

    const { rows, pagination, extra, info } = await quotas.addQuery<any>(
      runFn,
      {
        datasourceId: datasource._id,
      }
    )
    // remove the raw from execution incase transformer being used to hide data
    if (extra?.raw) {
      delete extra.raw
    }
    if (opts && opts.rowsOnly) {
      ctx.body = rows
    } else {
      ctx.body = { data: rows, pagination, ...extra, ...info }
    }
  } catch (err: any) {
    ctx.throw(400, err)
  }
}

export async function executeV1(ctx: UserCtx) {
  return execute(ctx, { rowsOnly: true, isAutomation: false })
}

export async function executeV2(
  ctx: UserCtx,
  { isAutomation }: { isAutomation?: boolean } = {}
) {
  return execute(ctx, { rowsOnly: false, isAutomation })
}

const removeDynamicVariables = async (queryId: any) => {
  const db = context.getAppDB()
  const query = await db.get<Query>(queryId)
  const datasource = await sdk.datasources.get(query.datasourceId)
  const dynamicVariables = datasource.config?.dynamicVariables as any[]

  if (dynamicVariables) {
    // delete dynamic variables from the datasource
    datasource.config!.dynamicVariables = dynamicVariables!.filter(
      (dv: any) => dv.queryId !== queryId
    )
    await db.put(datasource)

    // invalidate the deleted variables
    const variablesToDelete = dynamicVariables!.filter(
      (dv: any) => dv.queryId === queryId
    )
    await invalidateDynamicVariables(variablesToDelete)
  }
}

export async function destroy(ctx: UserCtx) {
  const db = context.getAppDB()
  const queryId = ctx.params.queryId
  await removeDynamicVariables(queryId)
  const query = await db.get<Query>(queryId)
  const datasource = await sdk.datasources.get(query.datasourceId)
  await db.remove(ctx.params.queryId, ctx.params.revId)
  ctx.message = `Query deleted.`
  ctx.status = 200
  await events.query.deleted(datasource, query)
}
