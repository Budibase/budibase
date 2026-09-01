import { context, events, HTTPError } from "@budibase/backend-core"
import { ActionFailureReason } from "@budibase/types"
import { findHBSBlocks } from "@budibase/string-templates"
import type {
  ExecuteV2QueryResponse,
  Query,
  QueryResponse,
  UserBindings,
} from "@budibase/types"
import { cloneDeep } from "lodash"
import env from "../../../environment"
import { getDatasourceWithEnvVars } from "../../../sdk/workspace/datasources/enrichment"
import { Thread, ThreadType } from "../../../threads"
import { QueryEvent, QueryEventParameters } from "../../../threads/definitions"

const Runner = new Thread(ThreadType.QUERY, {
  timeoutMs: env.QUERY_THREAD_TIMEOUT,
})

export interface ExecuteQueryAsAutomationRequest {
  parameters?: QueryEventParameters
}

export interface ExecuteQueryAsAutomationContext {
  // This is the workspace identifier, but remains appId until this legacy
  // automation query context can be separated from the HTTP context.
  appId?: string
  params: { queryId: string }
  request: { body: ExecuteQueryAsAutomationRequest }
  user: UserBindings
  body?: ExecuteV2QueryResponse
  throw: (status: number, error: Error) => never
}

const validateQueryInputs = (parameters: QueryEventParameters) => {
  for (const [key, value] of Object.entries(parameters)) {
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

const enrichParameters = (
  query: Query,
  requestParameters: QueryEventParameters = {}
): QueryEventParameters => {
  const paramNotSet = (value: unknown) => value === "" || value == undefined
  validateQueryInputs(requestParameters)
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

type UserWithQuerySensitiveFields = UserBindings & {
  roles?: Record<string, string>
  account?: object
  license?: object
}

const copyUser = (user?: UserBindings): UserBindings | undefined => {
  if (!user) {
    return undefined
  }
  const userWithSensitiveFields: UserWithQuerySensitiveFields = user
  const {
    roles: _deletedRoles,
    account: _deletedAccount,
    license: _deletedLicense,
    ...sanitisedUser
  } = userWithSensitiveFields
  return cloneDeep(sanitisedUser)
}

export const executeQueryAsAutomation = async (
  ctx: ExecuteQueryAsAutomationContext
) => {
  const db = context.getWorkspaceDB()
  const query = await db.tryGet<Query>(ctx.params.queryId)
  if (!query) {
    ctx.throw(404, new Error(`Query '${ctx.params.queryId}' not found`))
  }

  try {
    const { datasource, envVars } = await getDatasourceWithEnvVars(
      query.datasourceId
    )

    const inputs: QueryEvent = {
      appId: ctx.appId,
      datasource,
      queryVerb: query.queryVerb,
      fields: query.fields,
      parameters: enrichParameters(query, ctx.request.body.parameters),
      transformer: query.transformer,
      queryId: ctx.params.queryId,
      environmentVariables: envVars,
      nullDefaultSupport: query.nullDefaultSupport,
      ctx: {
        user: copyUser(ctx.user),
        auth: {},
      },
      schema: query.schema,
    }

    const { rows, pagination, extra, info } =
      await Runner.run<QueryResponse>(inputs)
    if (extra?.raw) {
      delete extra.raw
    }
    ctx.body = { data: rows, pagination, ...extra, ...info }
  } catch (err) {
    events.action.crudFailed({
      type: query.queryVerb,
      reason: ActionFailureReason.ERROR,
    })
    const error = err instanceof Error ? err : new Error(String(err))
    ctx.throw(error instanceof HTTPError ? error.status : 400, error)
  }
}
