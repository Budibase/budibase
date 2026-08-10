import { getQueryToolBindings, type QueryToolType } from "@budibase/shared-core"
import { SourceName, ToolType } from "@budibase/types"
import type {
  Agent,
  AgentOperationToolConfig,
  Datasource,
  Query,
} from "@budibase/types"

const sanitiseLegacyNameSegment = (name: string, maxLength: number) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, maxLength)

const getSourceType = (datasource: Datasource): QueryToolType =>
  datasource.source === SourceName.REST
    ? ToolType.REST_QUERY
    : ToolType.DATASOURCE_QUERY

const getSourceLabel = (datasource: Datasource) =>
  datasource.name ||
  (datasource.source === SourceName.REST ? "API" : "Datasource")

export const getLegacyQueryToolRuntimeBinding = ({
  datasource,
  query,
}: {
  datasource: Datasource
  query: Query
}) => {
  const sourceType = getSourceType(datasource)
  const runtimePrefix = sourceType === ToolType.REST_QUERY ? "rest" : "ds"
  const datasourceSegment =
    sanitiseLegacyNameSegment(getSourceLabel(datasource), 20) || "datasource"
  const querySegment =
    sanitiseLegacyNameSegment(query.name || "query", 24) || "query"

  return `${runtimePrefix}_${datasourceSegment}_${querySegment}`
}

const getCurrentQueryToolRuntimeBinding = ({
  datasource,
  query,
}: {
  datasource: Datasource
  query: Query
}) => {
  if (!query._id) {
    return undefined
  }

  return getQueryToolBindings({
    sourceType: getSourceType(datasource),
    sourceLabel: getSourceLabel(datasource),
    queryName: query.name,
    queryId: query._id,
  }).runtimeBinding
}

export const getLegacyQueryToolBindingReplacements = ({
  datasources,
  queries,
}: {
  datasources: Datasource[]
  queries: Query[]
}) => {
  const datasourcesById = new Map(
    datasources
      .filter(datasource => !!datasource._id)
      .map(datasource => [datasource._id!, datasource])
  )
  const candidatesByLegacy = new Map<
    string,
    { queryIds: Set<string>; currentBindings: Set<string> }
  >()
  const allCurrentBindings = new Set<string>()

  for (const query of queries) {
    const datasource = datasourcesById.get(query.datasourceId)
    if (!datasource) {
      continue
    }
    const current = getCurrentQueryToolRuntimeBinding({ datasource, query })
    if (!current) {
      continue
    }

    allCurrentBindings.add(current)
    const legacy = getLegacyQueryToolRuntimeBinding({ datasource, query })
    const candidates = candidatesByLegacy.get(legacy) || {
      queryIds: new Set<string>(),
      currentBindings: new Set<string>(),
    }
    candidates.queryIds.add(query._id!)
    candidates.currentBindings.add(current)
    candidatesByLegacy.set(legacy, candidates)
  }

  const replacements = new Map<string, string>()
  for (const [legacy, candidates] of candidatesByLegacy) {
    if (candidates.queryIds.size !== 1 || allCurrentBindings.has(legacy)) {
      continue
    }
    const [current] = candidates.currentBindings
    if (current) {
      replacements.set(legacy, current)
    }
  }

  return replacements
}

const replaceEnabledTools = ({
  enabledTools,
  replacements,
}: {
  enabledTools: AgentOperationToolConfig[] | undefined
  replacements: Map<string, string>
}) => {
  if (!enabledTools?.length) {
    return enabledTools
  }

  const replaced = enabledTools.map(tool => {
    const toolName = replacements.get(tool.toolName) || tool.toolName
    return toolName === tool.toolName ? tool : { ...tool, toolName }
  })
  if (replaced.every((tool, index) => tool === enabledTools[index])) {
    return enabledTools
  }

  const seenToolNames = new Set<string>()
  return replaced.filter(tool => {
    if (seenToolNames.has(tool.toolName)) {
      return false
    }
    seenToolNames.add(tool.toolName)
    return true
  })
}

export const replaceLegacyQueryToolReferences = ({
  agent,
  replacements,
}: {
  agent: Agent
  replacements: Map<string, string>
}) => {
  let changed = false
  const operations = agent.operations?.map(operation => {
    const enabledTools = replaceEnabledTools({
      enabledTools: operation.enabledTools,
      replacements,
    })
    if (enabledTools === operation.enabledTools) {
      return operation
    }

    changed = true
    return { ...operation, enabledTools }
  })

  return changed ? { ...agent, operations } : agent
}

export const hasQueryToolReferences = (agents: Agent[]) => {
  return agents.some(agent =>
    agent.operations?.some(operation =>
      operation.enabledTools?.some(
        tool =>
          tool.toolName.startsWith("rest_") || tool.toolName.startsWith("ds_")
      )
    )
  )
}
