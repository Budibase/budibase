import restUtils from "@/helpers/data/utils"
import {
  runtimeToReadableMap,
  readableToRuntimeMap,
  readableToRuntimeBinding,
  toBindingsArray,
  getRestBindings,
  runtimeToReadableBinding,
} from "@/dataBinding"
import { cloneDeep } from "lodash"
import { queries } from "@/stores/builder/queries"
import type {
  Datasource,
  EnrichedBinding,
  PreviewQueryResponse,
  Query,
  QuerySchema,
  RestAuthConfig,
  UIInternalDatasource,
} from "@budibase/types"
import { get } from "svelte/store"

/**
 * Converts path variables from OpenAPI format {var} to Handlebars format {{var}}
 */
export function convertPathVariables(value: string): string {
  if (!value) {
    return value
  }

  return value.replace(/\{([^{}]+)\}/g, (_match, token) => {
    const variable = token.trim()
    const sanitized = variable.match(/^[A-Za-z0-9._-]+/)
    const name = sanitized ? sanitized[0] : variable
    return `{{${name}}}`
  })
}

/**
 * Processes a path by removing leading slash and converting path variables
 */
export function processPath(path: string): string {
  if (path?.startsWith("/")) {
    path = path.substring(1)
  }

  path = convertPathVariables(path)

  return path
}

/**
 * Constructs a full path by combining base URL and endpoint path
 * Mirrors server-side logic from query/import/sources/base/index.ts
 * Note: baseUrl is expected to already be in {{var}} format from the server
 */
export function constructFullPath(
  baseUrl: string | undefined,
  endpointPath: string
): string {
  let path = processPath(endpointPath)

  if (baseUrl) {
    // This should have had its variables converted already
    // e.g. {{ customEndpoint }}
    let base = baseUrl
    if (base.endsWith("/")) {
      base = base.slice(0, -1)
    }
    path = path ? `${base}/${path}` : base
  }

  return path
}

export function buildUrl(
  base: string | undefined,
  queryParams: Record<string, any> = {},
  bindings: EnrichedBinding[] = []
): string {
  if (!base) {
    return base || ""
  }
  const qs = restUtils.buildQueryString(
    runtimeToReadableMap(bindings, queryParams)
  )
  let newUrl = base
  if (base.includes("?")) {
    const split = base.split("?")
    newUrl = split[0]
  }
  return qs.length === 0 ? newUrl : `${newUrl}?${qs}`
}

export const getBindingContext = (
  objects: Record<any, any>[]
): Record<string, any> => {
  return objects.reduce((acc, current) => ({ ...acc, ...(current || {}) }), {})
}

export interface DynamicVariablesResult {
  dynamicVariables: Record<string, any>
  globalDynamicBindings: Record<string, any>
}

export const getDynamicVariables = (
  datasource: any,
  queryId?: string,
  matchFn?: (variable: any, queryId: string) => boolean
): Record<string, any> => {
  const variablesList = datasource?.config?.dynamicVariables
  if (variablesList && variablesList.length > 0) {
    const filtered =
      queryId && matchFn
        ? variablesList.filter((variable: any) => matchFn(variable, queryId))
        : variablesList
    return filtered.reduce(
      (acc: Record<string, any>, next: any) => ({
        ...acc,
        [next.name]: next.value,
      }),
      {}
    )
  }
  return {}
}

export const buildDynamicVariables = (
  datasource: any,
  queryId?: string
): DynamicVariablesResult => {
  if (!queryId) {
    return {
      dynamicVariables: {},
      globalDynamicBindings: getDynamicVariables(datasource),
    }
  }

  return {
    dynamicVariables: getDynamicVariables(
      datasource,
      queryId,
      (variable, qId) => variable.queryId === qId
    ),
    globalDynamicBindings: getDynamicVariables(
      datasource,
      queryId,
      (variable, qId) => variable.queryId !== qId
    ),
  }
}

export function buildQueryBindings(
  datasource: any,
  requestBindings: Record<string, any>,
  globalDynamicBindings: Record<string, any>,
  dynamicVariables?: Record<string, any>
) {
  const staticVariables = datasource?.config?.staticVariables || {}
  const restBindings = getRestBindings() as EnrichedBinding[]

  const customRequestBindings = toBindingsArray(
    requestBindings,
    "Binding",
    "Bindings"
  ) as EnrichedBinding[]

  const globalDynamicRequestBindings = toBindingsArray(
    globalDynamicBindings,
    "Dynamic",
    "Dynamic"
  ) as EnrichedBinding[]

  const dataSourceStaticBindings = toBindingsArray(
    staticVariables,
    "Datasource.Static",
    "Datasource Static"
  ) as EnrichedBinding[]

  const mergedBindings: EnrichedBinding[] = [
    ...dataSourceStaticBindings,
    ...restBindings,
    ...customRequestBindings,
    ...globalDynamicRequestBindings,
  ]

  const contextObjects = [
    requestBindings,
    globalDynamicBindings,
    staticVariables,
  ]

  if (dynamicVariables) {
    contextObjects.push(dynamicVariables)
  }

  const bindingPreviewContext = getBindingContext(contextObjects)

  return {
    customRequestBindings,
    globalDynamicRequestBindings,
    dataSourceStaticBindings,
    restBindings,
    mergedBindings,
    bindingPreviewContext,
  }
}

export const shouldShowVariables = (
  dynamicVariables: Record<string, any>,
  success: boolean
) => {
  return !!(
    dynamicVariables &&
    (Object.keys(dynamicVariables).length > 0 || success)
  )
}

export function buildQuery(
  query: Query,
  urlQueries: Record<string, string>,
  requestBindings: Record<string, string>,
  mergedBindings: EnrichedBinding[],
  enabledHeaders: Record<string, boolean>,
  schema: Record<string, QuerySchema | string>,
  nestedSchemaFields?: Record<string, Record<string, QuerySchema | string>>
): Query {
  const newQuery = cloneDeep(query)
  const queryString = restUtils.buildQueryString(urlQueries)

  newQuery.parameters = restUtils.keyValueToQueryParameters(requestBindings)
  newQuery.fields.requestBody =
    typeof newQuery.fields.requestBody === "object"
      ? readableToRuntimeMap(mergedBindings, newQuery.fields.requestBody)
      : readableToRuntimeBinding(mergedBindings, newQuery.fields.requestBody)

  newQuery.fields.path = query.fields.path
  newQuery.fields.queryString = queryString
  newQuery.fields.disabledHeaders = restUtils.flipHeaderState(enabledHeaders)
  newQuery.schema = schema || {}
  newQuery.nestedSchemaFields = nestedSchemaFields || {}

  return newQuery
}

interface DynamicVariable {
  name: string
  value: string
  queryId: string
}

/**
 * Builds a new up-to-date set of dynamic binding entries
 * from the current query entries and the global list.
 *
 * Example contents.
 * `[
 *    { request-id : "{{ info.headers.[x-github-request-id] }}" },
 *    { some-var : "{{ data.some.path.to.mydata }}" }
 * ]`
 *
 * @param queryId
 * @param dynamicVariables
 * @param existingVariables
 * @returns
 */
export function rebuildVariables(
  queryId: string,
  dynamicVariables: Record<string, string> | undefined,
  existingVariables: DynamicVariable[] = []
): DynamicVariable[] {
  let variables: DynamicVariable[] = []
  if (dynamicVariables) {
    variables = Object.entries(dynamicVariables).map(([name, value]) => ({
      name,
      value,
      queryId,
    }))
  }

  // remove existing query variables (for changes and deletions)
  const filtered = existingVariables.filter(
    variable => variable.queryId !== queryId
  )
  // re-add the new query variables
  return [...filtered, ...variables]
}

export function prettifyQueryRequestBody(
  query: Query,
  mergedBindings: EnrichedBinding[]
): any {
  if (query?.fields?.requestBody) {
    return typeof query.fields.requestBody === "object"
      ? runtimeToReadableMap(mergedBindings, query.fields.requestBody)
      : runtimeToReadableBinding(mergedBindings, query.fields.requestBody)
  }
}

export function buildAuthConfigs(
  datasource: Datasource | UIInternalDatasource | undefined
): Array<{ label: string; value: string }> {
  if (datasource?.config?.authConfigs) {
    return datasource.config.authConfigs.map((c: RestAuthConfig) => ({
      label: c.name,
      value: c._id,
    }))
  }
  return []
}

export function validateQuery(
  url: string,
  requestBody: string | undefined,
  requestBindings: Record<string, string>,
  headers: Record<string, string>
): void {
  const forbiddenBindings = /{{\s?user(\.(\w|\$)*\s?|\s?)}}/g
  const bindingError = new Error(
    "'user' is a protected binding and cannot be used"
  )

  if (forbiddenBindings.test(url)) {
    throw bindingError
  }

  if (forbiddenBindings.test(requestBody ?? "")) {
    throw bindingError
  }

  Object.values(requestBindings).forEach(bindingValue => {
    if (forbiddenBindings.test(bindingValue)) {
      throw bindingError
    }
  })

  Object.values(headers).forEach(headerValue => {
    if (forbiddenBindings.test(headerValue)) {
      throw bindingError
    }
  })
}

export async function runQuery(
  builtQuery: Query,
  existingSchema?: Record<string, any>
): Promise<{
  response: PreviewQueryResponse
  schema: Record<string, any>
  nestedSchemaFields: Record<string, any>
}> {
  const response = await queries.preview(builtQuery)

  if (response.rows.length === 0) {
    return {
      response,
      schema: existingSchema || {},
      nestedSchemaFields: {},
    }
  }

  response.info = response.info || { code: 200 }

  const schema = existingSchema || {}
  if (existingSchema) {
    for (let [name, field] of Object.entries(response.schema)) {
      if (!schema[name]) {
        schema[name] = field
      }
    }
  } else {
    Object.assign(schema, response.schema)
  }

  return {
    response,
    schema,
    nestedSchemaFields: response.nestedSchemaFields,
  }
}

export function getSelectedQuery(queryId: string, datasourceId: string) {
  const queryStore = get(queries)

  const defaultQuery: Query = {
    datasourceId,
    parameters: [],
    fields: {
      // only init the objects, everything else is optional strings
      disabledHeaders: {},
      headers: {},
    },
    queryVerb: "read",
    name: "",
    transformer: null,
    schema: {},
    readable: true,
  }

  if (!queryId) {
    return defaultQuery
  }

  return queryStore.list.find(q => q._id === queryId) || defaultQuery
}

export function keyValueArrayToRecord(
  items: Array<{ name: string; value: any }>
): Record<string, any> {
  return items.reduce(
    (acc, { name, value }) => {
      acc[name] = value
      return acc
    },
    {} as Record<string, any>
  )
}
