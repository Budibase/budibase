import { default as threadUtils } from "./utils"
threadUtils.threadSetup()
import { WorkerCallback, QueryEvent, QueryVariable } from "./definitions"
import ScriptRunner from "../utilities/scriptRunner"
import { getIntegration } from "../integrations"
import { processStringSync } from "@budibase/string-templates"
import { context, cache, auth } from "@budibase/backend-core"
import { getGlobalIDFromUserMetadataID } from "../db/utils"
import sdk from "../sdk"
import { cloneDeep } from "lodash/fp"
import { SourceName } from "@budibase/types"

import { isSQL } from "../integrations/utils"
import { interpolateSQL } from "../integrations/queries/sql"
import { Query } from "@budibase/types"

class QueryRunner {
  datasource: any
  queryVerb: string
  queryId: string
  fields: any
  parameters: any
  pagination: any
  transformer: any
  cachedVariables: any[]
  ctx: any
  queryResponse: any
  noRecursiveQuery: boolean
  hasRerun: boolean
  hasRefreshedOAuth: boolean
  hasDynamicVariables: boolean
  schema: any

  constructor(input: QueryEvent, flags = { noRecursiveQuery: false }) {
    this.datasource = input.datasource
    this.queryVerb = input.queryVerb
    this.fields = input.fields
    this.parameters = input.parameters
    this.pagination = input.pagination
    this.transformer = input.transformer
    this.queryId = input.queryId
    this.schema = input.schema
    this.noRecursiveQuery = flags.noRecursiveQuery
    this.cachedVariables = []
    // Additional context items for enrichment
    this.ctx = input.ctx
    // allows the response from a query to be stored throughout this
    // execution so that if it needs to be re-used for another variable
    // it can be
    this.queryResponse = {}
    this.hasRerun = false
    this.hasRefreshedOAuth = false
    this.hasDynamicVariables = false
  }

  async execute(): Promise<any> {
    let { datasource, fields, queryVerb, transformer, schema } = this
    let datasourceClone = cloneDeep(datasource)
    let fieldsClone = cloneDeep(fields)

    const Integration = await getIntegration(datasourceClone.source)
    if (!Integration) {
      throw "Integration type does not exist."
    }

    if (datasourceClone.config.authConfigs) {
      const updatedConfigs = []
      for (let config of datasourceClone.config.authConfigs) {
        updatedConfigs.push(await sdk.queries.enrichContext(config, this.ctx))
      }
      datasourceClone.config.authConfigs = updatedConfigs
    }

    const integration = new Integration(datasourceClone.config)

    // define the type casting from the schema
    integration.defineTypeCastingFromSchema?.(schema)

    // pre-query, make sure datasource variables are added to parameters
    const parameters = await this.addDatasourceVariables()

    // Enrich the parameters with the addition context items.
    // 'user' is now a reserved variable key in mapping parameters
    const enrichedParameters = await sdk.queries.enrichContext(
      parameters,
      this.ctx
    )
    const enrichedContext = { ...enrichedParameters, ...this.ctx }

    // Parse global headers
    if (datasourceClone.config.defaultHeaders) {
      datasourceClone.config.defaultHeaders = await sdk.queries.enrichContext(
        datasourceClone.config.defaultHeaders,
        enrichedContext
      )
    }

    let query
    // handle SQL injections by interpolating the variables
    if (isSQL(datasourceClone)) {
      query = await interpolateSQL(fieldsClone, enrichedContext, integration)
    } else {
      query = await sdk.queries.enrichContext(fieldsClone, enrichedContext)
    }

    // Add pagination values for REST queries
    if (this.pagination) {
      query.paginationValues = this.pagination
    }

    let output = threadUtils.formatResponse(await integration[queryVerb](query))
    let rows = output,
      info = undefined,
      extra = undefined,
      pagination = undefined
    if (threadUtils.hasExtraData(output)) {
      rows = output.data
      info = output.info
      extra = output.extra
      pagination = output.pagination
    }

    // transform as required
    if (transformer) {
      const runner = new ScriptRunner(transformer, {
        data: rows,
        params: enrichedParameters,
      })
      rows = runner.execute()
    }

    // if the request fails we retry once, invalidating the cached value
    if (info && info.code >= 400 && !this.hasRerun) {
      if (
        this.ctx.user?.provider &&
        info.code === 401 &&
        !this.hasRefreshedOAuth
      ) {
        await this.refreshOAuth2(this.ctx)
        // Attempt to refresh the access token from the provider
        this.hasRefreshedOAuth = true
      } else {
        this.hasRerun = true
      }

      await threadUtils.invalidateDynamicVariables(this.cachedVariables)
      return this.execute()
    }

    // check for undefined response
    if (!rows) {
      rows = []
    }

    // needs to an array for next step
    if (!Array.isArray(rows)) {
      rows = [rows]
    }

    // map into JSON if just raw primitive here
    if (rows.find((row: any) => typeof row !== "object")) {
      rows = rows.map((value: any) => ({ value }))
    }

    // get all the potential fields in the schema
    let keys = rows.flatMap(Object.keys)

    if (integration.end) {
      integration.end()
    }

    return { rows, keys, info, extra, pagination }
  }

  async runAnotherQuery(queryId: string, parameters: any) {
    const db = context.getAppDB()
    const query = await db.get<Query>(queryId)
    const datasource = await sdk.datasources.get(query.datasourceId, {
      enriched: true,
    })
    return new QueryRunner(
      {
        datasource,
        queryVerb: query.queryVerb,
        fields: query.fields,
        parameters,
        transformer: query.transformer,
        queryId,
        ctx: this.ctx,
      },
      { noRecursiveQuery: true }
    ).execute()
  }

  async refreshOAuth2(ctx: any) {
    const { oauth2, providerType, _id } = ctx.user
    const { configId } = ctx.auth

    if (!providerType || !oauth2?.refreshToken) {
      throw new Error("No refresh token found for authenticated user")
    }

    const resp: any = await auth.refreshOAuthToken(
      oauth2.refreshToken,
      providerType,
      configId
    )

    // Refresh session flow. Should be in same location as refreshOAuthToken
    // There are several other properties available in 'resp'
    if (!resp.err) {
      const globalUserId = getGlobalIDFromUserMetadataID(_id)
      await auth.updateUserOAuth(globalUserId, resp)
      this.ctx.user = await cache.user.getUser(globalUserId)
    } else {
      // In this event the user may have oAuth issues that
      // could require re-authenticating with their provider.
      let errorMessage = resp.err.data ? resp.err.data : resp.err.toString()
      throw new Error(
        "OAuth2 access token could not be refreshed: " + errorMessage
      )
    }

    return resp
  }

  async getDynamicVariable(variable: QueryVariable) {
    let { parameters } = this
    const queryId = variable.queryId,
      name = variable.name
    let value = await threadUtils.checkCacheForDynamicVariable(queryId, name)
    if (!value) {
      value = this.queryResponse[queryId]
        ? this.queryResponse[queryId]
        : await this.runAnotherQuery(queryId, parameters)
      // store incase this query is to be called again
      this.queryResponse[queryId] = value
      await threadUtils.storeDynamicVariable(queryId, name, value)
    } else {
      this.cachedVariables.push({ queryId, name })
    }
    return value
  }

  async addDatasourceVariables() {
    let { datasource, parameters, fields } = this
    if (!datasource || !datasource.config) {
      return parameters
    }
    const staticVars = datasource.config.staticVariables || {}
    const dynamicVars = datasource.config.dynamicVariables || []
    for (let [key, value] of Object.entries(staticVars)) {
      if (!parameters[key]) {
        parameters[key] = value
      }
    }
    if (!this.noRecursiveQuery) {
      // need to see if this uses any variables
      const stringFields = JSON.stringify(fields)
      const foundVars = dynamicVars.filter((variable: QueryVariable) => {
        // don't allow a query to use its own dynamic variable (loop)
        if (variable.queryId === this.queryId) {
          return false
        }
        // look for {{ variable }} but allow spaces between handlebars
        const regex = new RegExp(`{{[ ]*${variable.name}[ ]*}}`)
        return regex.test(stringFields)
      })
      const dynamics = foundVars.map((dynVar: QueryVariable) =>
        this.getDynamicVariable(dynVar)
      )
      const responses = await Promise.all(dynamics)
      for (let i = 0; i < foundVars.length; i++) {
        const variable = foundVars[i]
        parameters[variable.name] = processStringSync(
          variable.value,
          {
            data: responses[i].rows,
            info: responses[i].extra,
          },
          {
            escapeNewlines: true,
          }
        )
        // make sure its known that this uses dynamic variables in case it fails
        this.hasDynamicVariables = true
      }
    }
    return parameters
  }
}

export function execute(input: QueryEvent, callback: WorkerCallback) {
  const run = async () => {
    const Runner = new QueryRunner(input)
    try {
      const response = await Runner.execute()
      callback(null, response)
    } catch (err) {
      callback(err)
    }
  }
  context.doInAppContext(input.appId!, async () => {
    if (input.environmentVariables) {
      return context.doInEnvironmentContext(input.environmentVariables, () => {
        return run()
      })
    } else {
      return run()
    }
  })
}
