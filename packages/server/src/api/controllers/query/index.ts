import {
  constants,
  context,
  events,
  HTTPError,
  utils,
} from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { utils as JsonUtils, ValidQueryNameRegex } from "@budibase/shared-core"
import { findHBSBlocks } from "@budibase/string-templates"
import {
  ActionFailureReason,
  ActionType,
  Agent,
  ContextUser,
  CreateDatasourceRequest,
  Datasource,
  DeleteQueryResponse,
  ExecuteQueryRequest,
  ExecuteV1QueryResponse,
  ExecuteV2QueryResponse,
  FetchQueriesResponse,
  FieldType,
  FindQueryResponse,
  ImportRestQueryRequest,
  ImportRestQueryResponse,
  ImportRestQueryInfoRequest,
  ImportRestQueryInfoResponse,
  JsonFieldSubType,
  PreviewQueryRequest,
  PreviewQueryResponse,
  Query,
  QueryResponse,
  QuerySchema,
  RestPreviewConfig,
  SaveQueryRequest,
  SaveQueryResponse,
  SessionCookie,
  SourceName,
  SSOProviderType,
  UserCtx,
} from "@budibase/types"
import { cloneDeep, merge } from "lodash"
import { ObjectId } from "mongodb"
import { generateQueryID } from "../../../db/utils"
import env from "../../../environment"
import sdk from "../../../sdk"
import { Thread, ThreadType } from "../../../threads"
import { QueryEvent, QueryEventParameters } from "../../../threads/definitions"
import { invalidateCachedVariable } from "../../../threads/utils"
import { save as saveDatasource } from "../datasource"
import {
  propagateCreatedResourceDependenciesWithWarning,
  propagateProjectDependencyChangesWithWarning,
  propagateProjectIdsToDependencySubtreesWithWarning,
} from "../../../utilities/projects"
import { builderSocket } from "../../../websockets"
import { createImporter, getImportInfo } from "./import"
import { ImportInfo } from "./import/sources/base"
import { mergePreviewSchema } from "./schema"

const Runner = new Thread(ThreadType.QUERY, {
  timeoutMs: env.QUERY_THREAD_TIMEOUT,
})

function sanitiseUserStructure(user: ContextUser) {
  const copiedUser = cloneDeep(user)
  delete copiedUser.roles
  delete copiedUser.account
  delete copiedUser.license
  return copiedUser
}

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

export async function fetchQueries(ctx: UserCtx<void, FetchQueriesResponse>) {
  ctx.body = await sdk.queries.fetch()
}

const _import = async (
  ctx: UserCtx<ImportRestQueryRequest, ImportRestQueryResponse>
) => {
  const body = ctx.request.body
  const importerInput = body.restTemplateId
    ? { data: await sdk.restTemplates.getSpec(body.restTemplateId) }
    : body
  const importer = await createImporter(importerInput)
  const importInfo = importer.getInfo()

  let datasourceId
  if (!body.datasourceId) {
    const {
      _id: _discardId,
      _rev: _discardRev,
      config: suppliedConfig,
      ...rest
    } = body.datasource ? cloneDeep(body.datasource) : ({} as Datasource)
    const config = suppliedConfig || {}
    const datasource: Datasource = {
      ...rest,
      type: "datasource",
      source: rest.source || SourceName.REST,
      name: rest.name || importInfo?.name,
      ...(body.restTemplateId ? { restTemplateId: body.restTemplateId } : {}),
      config: {
        ...config,
        defaultHeaders: config.defaultHeaders ?? {},
        rejectUnauthorized: config.rejectUnauthorized ?? true,
        downloadImages: config.downloadImages ?? true,
        url: config.url ?? importInfo?.url,
      },
    }
    importer.prepareDatasourceConfig(datasource)
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
    datasourceId = body.datasourceId
  }

  const importResult = await sdk.projects.doWithProjectAssignmentsLockIfEnabled(
    async () => {
      if (body.datasourceId && body.restTemplateId) {
        await sdk.restTemplates.withCustomRestTemplateLock({
          resource: body.restTemplateId,
          task: async () => {
            const templateExists = await sdk.restTemplates.exists(
              body.restTemplateId!
            )
            if (!templateExists) {
              throw new HTTPError("Custom REST template not found", 404)
            }

            const datasource = await sdk.datasources.get(body.datasourceId!)
            if (datasource.source !== SourceName.REST) {
              throw new HTTPError(
                "Custom REST templates can only be associated with REST datasources",
                400
              )
            }
            importer.prepareDatasourceConfig(datasource)
            datasource.restTemplateId = body.restTemplateId
            const response = await context
              .getWorkspaceDB()
              .put(sdk.tables.populateExternalTableSchemas(datasource))
            datasource._rev = response.rev
            await events.datasource.updated(datasource)
            builderSocket?.emitDatasourceUpdate(ctx, datasource)
          },
        })
      }

      try {
        const result = await importer.importQueries(
          datasourceId,
          body.selectedEndpointId
        )
        const datasource = await sdk.datasources.get(datasourceId)
        await propagateCreatedResourceDependenciesWithWarning(ctx, {
          rootResourceId: datasourceId,
          projectIds: datasource.projectIds,
          savedResources: result.queries,
        })
        return result
      } catch (error) {
        if (body.selectedEndpointId && error instanceof Error) {
          ctx.throw(400, error.message)
        }
        throw error
      }
    }
  )

  ctx.body = {
    ...importResult,
    datasourceId,
  }
}
export { _import as import }

export async function importInfo(
  ctx: UserCtx<ImportRestQueryInfoRequest, ImportRestQueryInfoResponse>
) {
  const { body } = ctx.request

  let info: ImportInfo
  if (body.restTemplateId) {
    info = await getImportInfo({
      data: await sdk.restTemplates.getSpec(body.restTemplateId),
    })
  } else if (body.data) {
    info = await getImportInfo({ data: body.data })
  } else if (body.url) {
    info = await getImportInfo({ url: body.url })
  } else {
    ctx.throw(400, "Import data, url, or REST template ID is required")
  }
  ctx.body = {
    name: info.name,
    url: info.url,
    docsUrl: info.docsUrl,
    endpoints: info.endpoints || [],
    securityHeaders: info.securityHeaders || [],
    securitySchemes: info.securitySchemes,
    staticVariables: info.staticVariables || {},
    servers: info.servers,
  }
}

async function saveUnlocked(ctx: UserCtx<SaveQueryRequest, SaveQueryResponse>) {
  const db = context.getWorkspaceDB()
  const query: Query = ctx.request.body
  delete query.projectIds

  // Validate query name
  if (!query?.name.match(ValidQueryNameRegex)) {
    ctx.throw(400, "Invalid query name")
  }

  const datasource = await sdk.datasources.get(query.datasourceId)

  let eventFn
  let existingQuery: Query | undefined
  let existingDatasource = datasource
  if (!query._id && !query._rev) {
    query._id = generateQueryID(query.datasourceId)
    // flag to state whether the default bindings are empty strings (old behaviour) or null
    query.nullDefaultSupport = true
    eventFn = () => events.query.created(datasource, query)
  } else {
    // check if flag has previously been set, don't let it change
    // allow it to be explicitly set to false via API incase this is ever needed
    const persistedQuery = await db.get<Query>(query._id)
    existingQuery = persistedQuery
    if (persistedQuery.datasourceId !== datasource._id) {
      existingDatasource = await sdk.datasources.get(
        persistedQuery.datasourceId
      )
    }
    if (persistedQuery.nullDefaultSupport && query.nullDefaultSupport == null) {
      query.nullDefaultSupport = true
    }
    eventFn = () => events.query.updated(datasource, query)
  }
  const datasourceChanged =
    existingQuery?.datasourceId !== undefined &&
    existingQuery.datasourceId !== datasource._id
  let referencingAgents: Agent[] = []
  if (
    existingQuery &&
    (datasourceChanged || existingQuery.name !== query.name)
  ) {
    referencingAgents = await sdk.ai.agents.migrateQueryToolReferences({
      existingDatasource,
      updatedDatasource: datasource,
      existingQuery,
      updatedQuery: query,
    })
  }
  const response = await db.put(query)
  await eventFn()
  query._rev = response.rev

  if (!existingQuery || existingQuery.datasourceId === datasource._id) {
    await propagateProjectDependencyChangesWithWarning(ctx, {
      rootResourceId: datasource._id!,
      currentProjectIds: datasource.projectIds,
      previousProjectIds: datasource.projectIds,
      previousResource: existingQuery,
      savedResource: query,
    })
  } else {
    const sourceProjectIds = new Set(existingDatasource.projectIds || [])
    const destinationProjectIds = new Set(datasource.projectIds || [])
    const sharedProjectIds = Array.from(destinationProjectIds).filter(
      projectId => sourceProjectIds.has(projectId)
    )
    const destinationOnlyProjectIds = Array.from(destinationProjectIds).filter(
      projectId => !sourceProjectIds.has(projectId)
    )

    await propagateProjectDependencyChangesWithWarning(ctx, {
      rootResourceId: datasource._id!,
      currentProjectIds: sharedProjectIds,
      previousProjectIds: sharedProjectIds,
      previousResource: existingQuery,
      savedResource: query,
    })
    await propagateProjectDependencyChangesWithWarning(ctx, {
      rootResourceId: datasource._id!,
      currentProjectIds: destinationOnlyProjectIds,
      previousProjectIds: destinationOnlyProjectIds,
      savedResource: query,
    })

    const newAgentProjectIds = Array.from(
      new Set(referencingAgents.flatMap(agent => agent.projectIds || []))
    ).filter(
      projectId =>
        sourceProjectIds.has(projectId) && !destinationProjectIds.has(projectId)
    )

    await propagateProjectDependencyChangesWithWarning(ctx, {
      rootResourceId: datasource._id!,
      currentProjectIds: newAgentProjectIds,
      previousProjectIds: newAgentProjectIds,
      previousResource: existingQuery,
      savedResource: query,
    })

    await propagateProjectIdsToDependencySubtreesWithWarning(ctx, {
      blockedResourceIds: [query._id!],
      dependencyIds: [datasource._id!],
      projectIds: newAgentProjectIds,
    })
  }

  ctx.body = query
}

export async function save(ctx: UserCtx<SaveQueryRequest, SaveQueryResponse>) {
  await sdk.projects.doWithProjectAssignmentsLockIfEnabled(() =>
    saveUnlocked(ctx)
  )
}

export async function find(ctx: UserCtx<void, FindQueryResponse>) {
  const queryId = ctx.params.queryId
  ctx.body = await sdk.queries.find(queryId)
}

//Required to discern between OIDC OAuth config entries
function getOAuthConfigCookieId(ctx: UserCtx): string | undefined {
  if (ctx.user.providerType === SSOProviderType.OIDC) {
    return utils.getCookie<string>(ctx, constants.Cookie.OIDC_CONFIG)
  }
}

function getAuthConfig(ctx: UserCtx) {
  const authCookie = utils.getCookie<SessionCookie>(ctx, constants.Cookie.Auth)
  return {
    configId: getOAuthConfigCookieId(ctx),
    sessionId: authCookie ? authCookie.sessionId : undefined,
  }
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
    let value = requestParameters[parameter.name]
    if (value == null || value === "") {
      value = parameter.default
    }
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
  const rawDatasource = await sdk.datasources.get(ctx.request.body.datasourceId)
  const { datasource, envVars } =
    await sdk.datasources.enrichDatasourceWithValues(rawDatasource)
  // Kept unresolved so the request preview can show bindings rather than the
  // values they resolve to
  const previewConfig: RestPreviewConfig = {
    url: rawDatasource.config?.url,
    defaultHeaders: rawDatasource.config?.defaultHeaders,
    defaultQueryParameters: rawDatasource.config?.defaultQueryParameters,
  }
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
      const db = context.getWorkspaceDB()
      const existing = (await db.get(queryId)) as Query
      existingSchema = existing.schema
    } catch (err: any) {
      if (err.status !== 404) {
        ctx.throw(500, "Unable to retrieve existing query")
      }
    }
  }

  const authConfigCtx = getAuthConfig(ctx)

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
    includeRequest: true,
    previewConfig,
    // have to pass down to the thread runner - can't put into context now
    environmentVariables: envVars,
    ctx: {
      // sanitise the user object to remove circular references
      user: sanitiseUserStructure(ctx.user),
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

  const schema = mergePreviewSchema({
    previewSchema,
    existingSchema,
    firstRow: rows?.[0],
  })
  // remove configuration before sending event
  delete datasource.config
  await events.query.previewed(datasource, ctx.request.body)
  ctx.body = {
    rows,
    nestedSchemaFields,
    schema,
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
  const db = context.getWorkspaceDB()

  const query = await db.get<Query>(ctx.params.queryId)
  const { datasource, envVars } = await sdk.datasources.getWithEnvVars(
    query.datasourceId
  )

  let authConfigCtx = {}
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
        // sanitise the user object to remove circular references
        user: sanitiseUserStructure(ctx.user),
        auth: { ...authConfigCtx },
      },
      schema: query.schema,
    }

    const { rows, pagination, extra, info } =
      query.queryVerb === "read" || opts.isAutomation
        ? await Runner.run<QueryResponse>(inputs)
        : await quotas.addAction(ActionType.CRUD, async () => {
            const response = await Runner.run<QueryResponse>(inputs)
            events.action.crudExecuted({ type: query.queryVerb })
            return response
          })
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
    events.action.crudFailed({
      type: query.queryVerb,
      reason: ActionFailureReason.ERROR,
    })
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
  const db = context.getWorkspaceDB()
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
  const db = context.getWorkspaceDB()
  const queryId = ctx.params.queryId as string
  await removeDynamicVariables(queryId)
  const query = await db.get<Query>(queryId)
  const datasource = await sdk.datasources.get(query.datasourceId)
  await db.remove(ctx.params.queryId, ctx.params.revId)
  ctx.body = { message: `Query deleted.` }
  await events.query.deleted(datasource, query, context.getWorkspaceId()!)
}
