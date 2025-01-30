import { generateQueryID } from "../../../db/utils"
import { Thread, ThreadType } from "../../../threads"
import { save as saveDatasource } from "../datasource"
import { RestImporter } from "./import"
import { invalidateCachedVariable } from "../../../threads/utils"
import env from "../../../environment"
import { constants, context, events, utils } from "@budibase/backend-core"
import sdk from "../../../sdk"
import { QueryEvent, QueryEventParameters } from "../../../threads/definitions"
import {
  ConfigType,
  CreateDatasourceRequest,
  Datasource,
  ExecuteQueryRequest,
  ExecuteV2QueryResponse,
  ExecuteV1QueryResponse,
  FetchQueriesResponse,
  FieldType,
  FindQueryResponse,
  ImportRestQueryRequest,
  ImportRestQueryResponse,
  JsonFieldSubType,
  PreviewQueryRequest,
  PreviewQueryResponse,
  Query,
  QueryResponse,
  QuerySchema,
  SaveQueryRequest,
  SaveQueryResponse,
  SessionCookie,
  SourceName,
  UserCtx,
  DeleteQueryResponse,
} from "@budibase/types"
import { utils as JsonUtils, ValidQueryNameRegex } from "@budibase/shared-core"
import { findHBSBlocks } from "@budibase/string-templates"
import { ObjectId } from "mongodb"
import { merge } from "lodash"

const Runner = new Thread(ThreadType.QUERY, {
  timeoutMs: env.QUERY_THREAD_TIMEOUT,
})

function validateQueryInputs(parameters: QueryEventParameters) {
  for (let entry of Object.entries(parameters)) {
    const [key, value] = entry
    if (typeof value !== "string") {
      continue
    }
    if (findHBSBlocks(value).length !== 0) {
      throw new Error(
        `Parameter '${key}' input contains a handlebars binding - this is not allowed.`
      )
    }
  }
}

export async function fetch(ctx: UserCtx<void, FetchQueriesResponse>) {
  ctx.body = await sdk.queries.fetch()
}

const _import = async (
  ctx: UserCtx<ImportRestQueryRequest, ImportRestQueryResponse>
) => {
  const body = ctx.request.body
  const data = body.data

  const importer = new RestImporter(data)
  await importer.init()

  let datasourceId
  if (!body.datasourceId) {
    // construct new datasource
    const info: any = await importer.getInfo()
    let datasource: Datasource = {
      type: "datasource",
      source: SourceName.REST,
      config: {
        url: info.url,
        defaultHeaders: [],
        rejectUnauthorized: true,
      },
      name: info.name,
    }
    // save the datasource
    const datasourceCtx: UserCtx<CreateDatasourceRequest> = merge(ctx, {
      request: {
        body: {
          datasource,
          tablesFilter: [],
        },
      },
    })
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
}
export { _import as import }

export async function save(ctx: UserCtx<SaveQueryRequest, SaveQueryResponse>) {
  const db = context.getAppDB()
  const query: Query = ctx.request.body

  // Validate query name
  if (!query?.name.match(ValidQueryNameRegex)) {
    ctx.throw(400, "Invalid query name")
  }

  const datasource = await sdk.datasources.get(query.datasourceId)

  let eventFn
  if (!query._id && !query._rev) {
    query._id = generateQueryID(query.datasourceId)
    // flag to state whether the default bindings are empty strings (old behaviour) or null
    query.nullDefaultSupport = true
    eventFn = () => events.query.created(datasource, query)
  } else {
    // check if flag has previously been set, don't let it change
    // allow it to be explicitly set to false via API incase this is ever needed
    const existingQuery = await db.get<Query>(query._id)
    if (existingQuery.nullDefaultSupport && query.nullDefaultSupport == null) {
      query.nullDefaultSupport = true
    }
    eventFn = () => events.query.updated(datasource, query)
  }
  const response = await db.put(query)
  await eventFn()
  query._rev = response.rev

  ctx.body = query
}

export async function find(ctx: UserCtx<void, FindQueryResponse>) {
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
  const authCookie = utils.getCookie<SessionCookie>(ctx, constants.Cookie.Auth)
  let authConfigCtx: any = {}
  authConfigCtx["configId"] = getOAuthConfigCookieId(ctx)
  authConfigCtx["sessionId"] = authCookie ? authCookie.sessionId : null
  return authConfigCtx
}

function enrichParameters(
  query: Query,
  requestParameters: QueryEventParameters = {}
): QueryEventParameters {
  const paramNotSet = (val: unknown) => val === "" || val == undefined
  // first check parameters are all valid
  validateQueryInputs(requestParameters)
  // make sure parameters are fully enriched with defaults
  for (const parameter of query.parameters) {
    let value: string | null =
      requestParameters[parameter.name] || parameter.default
    if (query.nullDefaultSupport && paramNotSet(value)) {
      value = null
    }
    requestParameters[parameter.name] = value
  }
  return requestParameters
}

export async function preview(
  ctx: UserCtx<PreviewQueryRequest, PreviewQueryResponse>
) {
  const { datasource, envVars } = await sdk.datasources.getWithEnvVars(
    ctx.request.body.datasourceId
  )
  // preview may not have a queryId as it hasn't been saved, but if it does
  // this stops dynamic variables from calling the same query
  const queryId = ctx.request.body.queryId
  // the body contains the makings of a query, which has not been saved yet
  const query: Query = ctx.request.body
  // hasn't been saved, new query
  if (!queryId && !query._id) {
    query.nullDefaultSupport = true
  }

  let existingSchema = query.schema
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

  function getFieldMetadata(field: any, key: string): QuerySchema {
    const makeQuerySchema = (
      type: FieldType,
      name: string,
      subtype?: string
    ): QuerySchema => ({
      type,
      name,
      subtype,
    })
    // Because custom queries have no fixed schema, we dynamically determine the schema,
    // however types cannot be determined from null. We have no 'unknown' type, so we default to string.
    let type = typeof field,
      fieldMetadata = makeQuerySchema(FieldType.STRING, key)
    if (field != null)
      switch (type) {
        case "boolean":
          fieldMetadata = makeQuerySchema(FieldType.BOOLEAN, key)
          break
        case "object":
          if (field instanceof Date) {
            fieldMetadata = makeQuerySchema(FieldType.DATETIME, key)
          } else if (Array.isArray(field)) {
            if (field.some(item => JsonUtils.hasSchema(item))) {
              fieldMetadata = makeQuerySchema(
                FieldType.JSON,
                key,
                JsonFieldSubType.ARRAY
              )
            } else {
              fieldMetadata = makeQuerySchema(FieldType.ARRAY, key)
            }
          } else if (field instanceof ObjectId) {
            fieldMetadata = makeQuerySchema(FieldType.STRING, key)
          } else {
            fieldMetadata = makeQuerySchema(FieldType.JSON, key)
          }
          break
        case "number":
          fieldMetadata = makeQuerySchema(FieldType.NUMBER, key)
          break
      }
    return fieldMetadata
  }

  function buildNestedSchema(
    nestedSchemaFields: {
      [key: string]: Record<string, string | QuerySchema>
    },
    key: string,
    fieldArray: any[]
  ) {
    let schema: { [key: string]: any } = {}
    // build the schema by aggregating all row objects in the array
    for (const item of fieldArray) {
      if (JsonUtils.hasSchema(item)) {
        for (const [key, value] of Object.entries(item)) {
          schema[key] = getFieldMetadata(value, key)
        }
      }
    }
    nestedSchemaFields[key] = schema
  }

  function getSchemaFields(
    rows: any[],
    keys: string[]
  ): {
    previewSchema: Record<string, string | QuerySchema>
    nestedSchemaFields: {
      [key: string]: Record<string, string | QuerySchema>
    }
  } {
    const previewSchema: Record<string, string | QuerySchema> = {}
    const nestedSchemaFields: {
      [key: string]: Record<string, string | QuerySchema>
    } = {}
    if (rows?.length > 0) {
      for (let key of new Set(keys)) {
        const fieldMetadata = getFieldMetadata(rows[0][key], key)
        previewSchema[key] = fieldMetadata
        if (
          fieldMetadata.type === FieldType.JSON &&
          fieldMetadata.subtype === JsonFieldSubType.ARRAY
        ) {
          buildNestedSchema(nestedSchemaFields, key, rows[0][key])
        }
      }
    }
    return { previewSchema, nestedSchemaFields }
  }

  const inputs: QueryEvent = {
    appId: ctx.appId,
    queryVerb: query.queryVerb,
    fields: query.fields,
    parameters: enrichParameters(query),
    transformer: query.transformer,
    schema: query.schema,
    nullDefaultSupport: query.nullDefaultSupport,
    queryId,
    datasource,
    // have to pass down to the thread runner - can't put into context now
    environmentVariables: envVars,
    ctx: {
      user: ctx.user,
      auth: { ...authConfigCtx },
    },
  }

  let queryResponse: QueryResponse
  try {
    queryResponse = await Runner.run<QueryResponse>(inputs)
  } catch (err: any) {
    ctx.throw(400, err)
  }

  const { rows, keys, info, extra } = queryResponse
  const { previewSchema, nestedSchemaFields } = getSchemaFields(rows, keys)

  // if existing schema, update to include any previous schema keys
  if (existingSchema) {
    for (let key of Object.keys(existingSchema)) {
      if (!previewSchema[key]) {
        previewSchema[key] = existingSchema[key]
      }
    }
  }
  // remove configuration before sending event
  delete datasource.config
  await events.query.previewed(datasource, ctx.request.body)
  ctx.body = {
    rows,
    nestedSchemaFields,
    schema: previewSchema,
    info,
    extra,
  }
}

async function execute(
  ctx: UserCtx<
    ExecuteQueryRequest,
    ExecuteV2QueryResponse | ExecuteV1QueryResponse
  >,
  opts = { rowsOnly: false, isAutomation: false }
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

  // call the relevant CRUD method on the integration class
  try {
    const inputs: QueryEvent = {
      appId: ctx.appId,
      datasource,
      queryVerb: query.queryVerb,
      fields: query.fields,
      pagination: ctx.request.body.pagination,
      parameters: enrichParameters(query, ctx.request.body.parameters),
      transformer: query.transformer,
      queryId: ctx.params.queryId,
      // have to pass down to the thread runner - can't put into context now
      environmentVariables: envVars,
      nullDefaultSupport: query.nullDefaultSupport,
      ctx: {
        user: ctx.user,
        auth: { ...authConfigCtx },
      },
      schema: query.schema,
    }

    const { rows, pagination, extra, info } = await Runner.run<QueryResponse>(
      inputs
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

export async function executeV1(
  ctx: UserCtx<ExecuteQueryRequest, ExecuteV1QueryResponse>
) {
  return execute(ctx, { rowsOnly: true, isAutomation: false })
}

export async function executeV2(
  ctx: UserCtx<ExecuteQueryRequest, ExecuteV2QueryResponse>
) {
  return execute(ctx, { rowsOnly: false, isAutomation: false })
}

export async function executeV2AsAutomation(
  ctx: UserCtx<ExecuteQueryRequest, ExecuteV2QueryResponse>
) {
  return execute(ctx, { rowsOnly: false, isAutomation: true })
}

const removeDynamicVariables = async (queryId: string) => {
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
    await invalidateCachedVariable(variablesToDelete)
  }
}

export async function destroy(ctx: UserCtx<void, DeleteQueryResponse>) {
  const db = context.getAppDB()
  const queryId = ctx.params.queryId as string
  await removeDynamicVariables(queryId)
  const query = await db.get<Query>(queryId)
  const datasource = await sdk.datasources.get(query.datasourceId)
  await db.remove(ctx.params.queryId, ctx.params.revId)
  ctx.body = { message: `Query deleted.` }
  await events.query.deleted(datasource, query)
}
