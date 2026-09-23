import { ToolType } from "@budibase/types"

export type QueryToolType = ToolType.REST_QUERY | ToolType.DATASOURCE_QUERY

export const isQueryToolType = (
  sourceType: ToolType | undefined
): sourceType is QueryToolType =>
  sourceType === ToolType.REST_QUERY || sourceType === ToolType.DATASOURCE_QUERY

interface QueryToolBindingOptions {
  sourceType: QueryToolType
  sourceLabel?: string
  queryName?: string
  queryId: string
}

type ReadableQueryToolBindingOptions = Omit<QueryToolBindingOptions, "queryId">

const sanitiseRuntimeNameSegment = (name: string, maxLength: number) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, maxLength)

const sanitiseReadableSource = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")

const getRuntimeIdentifier = (queryId: string) => {
  const identifier = sanitiseRuntimeNameSegment(queryId, queryId.length).slice(
    -16
  )
  if (!identifier) {
    throw new Error("Query ID must contain letters or numbers")
  }
  return identifier
}

export const getReadableQueryToolBinding = ({
  sourceType,
  sourceLabel,
  queryName,
}: ReadableQueryToolBindingOptions) => {
  const isRestQuery = sourceType === ToolType.REST_QUERY
  const resolvedSourceLabel =
    sourceLabel || (isRestQuery ? "API" : "Datasource")
  const readableSource = sanitiseReadableSource(resolvedSourceLabel)
  const readablePrefix = isRestQuery ? `api.${readableSource}` : readableSource

  return `${readablePrefix}.${queryName || "query"}`
}

export const getQueryToolBindings = ({
  sourceType,
  sourceLabel,
  queryName,
  queryId,
}: QueryToolBindingOptions) => {
  const isRestQuery = sourceType === ToolType.REST_QUERY
  const resolvedSourceLabel =
    sourceLabel || (isRestQuery ? "API" : "Datasource")
  const datasourceSegment =
    sanitiseRuntimeNameSegment(resolvedSourceLabel, 20) || "datasource"
  const querySegment =
    sanitiseRuntimeNameSegment(queryName || "query", 20) || "query"
  const runtimeIdentifier = getRuntimeIdentifier(queryId)
  const runtimePrefix = isRestQuery ? "rest" : "ds"

  return {
    readableBinding: getReadableQueryToolBinding({
      sourceType,
      sourceLabel,
      queryName,
    }),
    runtimeBinding: `${runtimePrefix}_${datasourceSegment}_${querySegment}_${runtimeIdentifier}`,
  }
}
