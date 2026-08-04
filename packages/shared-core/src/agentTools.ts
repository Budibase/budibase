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
}

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

export const getQueryToolBindings = ({
  sourceType,
  sourceLabel,
  queryName,
}: QueryToolBindingOptions) => {
  const isRestQuery = sourceType === ToolType.REST_QUERY
  const resolvedSourceLabel =
    sourceLabel || (isRestQuery ? "API" : "Datasource")
  const readableSource =
    sanitiseReadableSource(resolvedSourceLabel) || "datasource"
  const readablePrefix = isRestQuery ? `api.${readableSource}` : readableSource
  const datasourceSegment =
    sanitiseRuntimeNameSegment(resolvedSourceLabel, 20) || "datasource"
  const querySegment =
    sanitiseRuntimeNameSegment(queryName || "query", 24) || "query"
  const runtimePrefix = isRestQuery ? "rest" : "ds"

  return {
    readableBinding: `${readablePrefix}.${queryName || "query"}`,
    runtimeBinding: `${runtimePrefix}_${datasourceSegment}_${querySegment}`,
  }
}
