import { context, docIds, HTTPError, utils } from "@budibase/backend-core"
import {
  DocumentType,
  SourceName,
  type Datasource,
  type FunctionQueryCapability,
  type FunctionQueryCapabilityInput,
  type FunctionQueryCatalogEntry,
  type Query,
  type QueryParameter,
  type QueryVerb,
} from "@budibase/types"

interface ResolvedQuery {
  query: Query & { _id: string }
  datasource: Datasource & { _id: string }
  parameterNames: string[]
}

const SUPPORTED_QUERY_VERBS: QueryVerb[] = [
  "read",
  "create",
  "update",
  "delete",
  "patch",
]

const isQueryParameter = (parameter: unknown): parameter is QueryParameter => {
  if (typeof parameter !== "object" || parameter === null) {
    return false
  }

  if (!("name" in parameter) || !("default" in parameter)) {
    return false
  }

  const { name, default: defaultValue } = parameter

  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    typeof defaultValue === "string"
  )
}

const getParameterNames = (query: Query) => {
  if (!Array.isArray(query.parameters)) {
    throw new HTTPError(`Query '${query._id}' has invalid parameters.`, 400)
  }

  const parameterNames = query.parameters.map(parameter => {
    if (!isQueryParameter(parameter)) {
      throw new HTTPError(`Query '${query._id}' has invalid parameters.`, 400)
    }
    return parameter.name
  })
  if (new Set(parameterNames).size !== parameterNames.length) {
    throw new HTTPError(
      `Query '${query._id}' has duplicate parameter names.`,
      400
    )
  }
  return parameterNames
}

const isSupportedSource = (source: SourceName) => {
  return Object.values(SourceName).includes(source)
}

async function resolveQuery(
  query: Query & { _id: string },
  datasource?: Datasource & { _id: string }
): Promise<ResolvedQuery> {
  if (!SUPPORTED_QUERY_VERBS.includes(query.queryVerb)) {
    throw new HTTPError(
      `Query '${query._id}' is not supported by Functions.`,
      400
    )
  }

  const resolvedDatasource =
    datasource ||
    (await context.getWorkspaceDB().tryGet<Datasource>(query.datasourceId))
  if (
    !resolvedDatasource?._id ||
    !isSupportedSource(resolvedDatasource.source)
  ) {
    throw new HTTPError(
      `Query '${query._id}' is not supported by Functions.`,
      400
    )
  }

  return {
    query,
    datasource: { ...resolvedDatasource, _id: resolvedDatasource._id },
    parameterNames: getParameterNames(query),
  }
}

export const resolveSavedQuery = async (
  queryId: string
): Promise<ResolvedQuery> => {
  const db = context.getWorkspaceDB()
  if (!docIds.isType(queryId, DocumentType.QUERY)) {
    throw new HTTPError(`Query '${queryId}' not found.`, 404)
  }

  const query = await db.tryGet<Query>(queryId)
  if (!query?._id) {
    throw new HTTPError(`Query '${queryId}' not found.`, 404)
  }

  return await resolveQuery({ ...query, _id: query._id })
}

const validateAliasMappings = (
  resolved: Array<{
    input: FunctionQueryCapabilityInput
    query: ResolvedQuery
  }>
) => {
  const datasourceIdsByAlias = new Map<string, string>()
  const aliasesByDatasourceId = new Map<string, string>()
  const queryAliases = new Set<string>()

  for (const { input, query } of resolved) {
    const existingDatasourceId = datasourceIdsByAlias.get(input.datasourceAlias)
    if (existingDatasourceId && existingDatasourceId !== query.datasource._id) {
      throw new HTTPError(
        `Datasource alias '${input.datasourceAlias}' is already in use.`,
        400
      )
    }
    datasourceIdsByAlias.set(input.datasourceAlias, query.datasource._id)

    const existingAlias = aliasesByDatasourceId.get(query.datasource._id)
    if (existingAlias && existingAlias !== input.datasourceAlias) {
      throw new HTTPError(
        `Datasource '${query.datasource.name || query.datasource.source}' has multiple aliases.`,
        400
      )
    }
    aliasesByDatasourceId.set(query.datasource._id, input.datasourceAlias)

    const queryAlias = `${input.datasourceAlias}.${input.queryAlias}`
    if (queryAliases.has(queryAlias)) {
      throw new HTTPError(`Query alias '${queryAlias}' is already in use.`, 400)
    }
    queryAliases.add(queryAlias)
  }
}

export const buildCapabilities = async (
  inputs: FunctionQueryCapabilityInput[],
  existing: FunctionQueryCapability[] = []
): Promise<FunctionQueryCapability[]> => {
  const resolved = await Promise.all(
    inputs.map(async input => ({
      input,
      query: await resolveSavedQuery(input.queryId),
    }))
  )
  validateAliasMappings(resolved)

  return resolved.map(({ input, query }) => {
    const persisted = existing.find(
      capability => capability.queryId === input.queryId
    )
    return {
      capabilityId: persisted?.capabilityId || utils.newid(),
      queryId: input.queryId,
      datasourceAlias: input.datasourceAlias,
      queryAlias: input.queryAlias,
      parameterNames: query.parameterNames,
    }
  })
}

const toCatalogEntry = (
  resolved: ResolvedQuery
): FunctionQueryCatalogEntry => ({
  queryId: resolved.query._id,
  queryName: resolved.query.name,
  datasourceId: resolved.datasource._id,
  datasourceName: resolved.datasource.name || resolved.datasource.source,
  source: resolved.datasource.source,
  kind: resolved.datasource.source === SourceName.REST ? "api" : "data",
  parameters: resolved.parameterNames.map(name => ({ name })),
})

export const getQueryCatalog = async () => {
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<Query>(
    docIds.getDocParams(DocumentType.QUERY, null, { include_docs: true })
  )
  const datasourceCache = new Map<
    string,
    Promise<(Datasource & { _id: string }) | undefined>
  >()
  const getDatasource = (datasourceId: string) => {
    const cached = datasourceCache.get(datasourceId)
    if (cached) {
      return cached
    }

    const datasource = db
      .tryGet<Datasource>(datasourceId)
      .then(datasource =>
        datasource?._id ? { ...datasource, _id: datasource._id } : undefined
      )
    datasourceCache.set(datasourceId, datasource)
    return datasource
  }
  const entries = await Promise.all(
    result.rows.map(async row => {
      const query = row.doc
      if (!query?._id) {
        return undefined
      }
      try {
        return toCatalogEntry(
          await resolveQuery(
            { ...query, _id: query._id },
            await getDatasource(query.datasourceId)
          )
        )
      } catch (error) {
        if (error instanceof HTTPError) {
          return undefined
        }
        throw error
      }
    })
  )

  return entries
    .filter((entry): entry is FunctionQueryCatalogEntry => !!entry)
    .sort(
      (a, b) =>
        a.datasourceName.localeCompare(b.datasourceName) ||
        a.queryName.localeCompare(b.queryName)
    )
}
