import { getQueryToolBindings, type QueryToolType } from "@budibase/shared-core"
import { SourceName, ToolType } from "@budibase/types"
import type {
  Agent,
  AgentOperationToolConfig,
  Datasource,
  Query,
} from "@budibase/types"
import { fetch, update } from "./crud"

interface QueryToolReferenceMigration {
  existingDatasource: Datasource
  updatedDatasource: Datasource
  existingQuery: Query
  updatedQuery: Query
}

interface ToolBindings {
  readableBinding: string
  runtimeBinding: string
}

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const readableBindingRegex = (binding: string) =>
  new RegExp(`(\\{\\{\\s*)${escapeRegExp(binding)}(\\s*\\}\\})`, "g")

const replaceReadableBinding = (
  promptInstructions: string | undefined,
  existingBinding: string,
  updatedBinding: string
) => {
  if (!promptInstructions || existingBinding === updatedBinding) {
    return promptInstructions
  }

  return promptInstructions.replace(
    readableBindingRegex(existingBinding),
    (_match, opening: string, closing: string) =>
      `${opening}${updatedBinding}${closing}`
  )
}

const replaceRuntimeBinding = (
  enabledTools: AgentOperationToolConfig[] | undefined,
  existingBinding: string,
  updatedBinding: string
) => {
  if (!enabledTools || existingBinding === updatedBinding) {
    return enabledTools
  }
  if (!enabledTools.some(tool => tool.toolName === existingBinding)) {
    return enabledTools
  }

  const hasUpdatedBinding = enabledTools.some(
    tool => tool.toolName === updatedBinding
  )
  const updatedTools = hasUpdatedBinding
    ? enabledTools.filter(tool => tool.toolName !== existingBinding)
    : enabledTools.map(tool =>
        tool.toolName === existingBinding
          ? { ...tool, toolName: updatedBinding }
          : tool
      )

  const seenToolNames = new Set<string>()
  return updatedTools.filter(tool => {
    if (seenToolNames.has(tool.toolName)) {
      return false
    }
    seenToolNames.add(tool.toolName)
    return true
  })
}

const agentReferencesQueryTool = ({
  agent,
  bindings,
}: {
  agent: Agent
  bindings: ToolBindings
}) =>
  agent.operations?.some(
    operation =>
      (operation.promptInstructions &&
        readableBindingRegex(bindings.readableBinding).test(
          operation.promptInstructions
        )) ||
      operation.enabledTools?.some(
        tool => tool.toolName === bindings.runtimeBinding
      )
  ) || false

const agentReferencesRuntimeTool = ({
  agent,
  runtimeBinding,
}: {
  agent: Agent
  runtimeBinding: string
}) =>
  agent.operations?.some(operation =>
    operation.enabledTools?.some(tool => tool.toolName === runtimeBinding)
  ) || false

export const updateAgentQueryToolReferences = ({
  agent,
  existingBindings,
  updatedBindings,
}: {
  agent: Agent
  existingBindings: ToolBindings
  updatedBindings: ToolBindings
}): Agent | undefined => {
  let changed = false
  const operations = agent.operations?.map(operation => {
    const promptInstructions = replaceReadableBinding(
      operation.promptInstructions,
      existingBindings.readableBinding,
      updatedBindings.readableBinding
    )
    const enabledTools = replaceRuntimeBinding(
      operation.enabledTools,
      existingBindings.runtimeBinding,
      updatedBindings.runtimeBinding
    )

    if (
      promptInstructions === operation.promptInstructions &&
      enabledTools === operation.enabledTools
    ) {
      return operation
    }

    changed = true
    return {
      ...operation,
      promptInstructions,
      enabledTools,
    }
  })

  return changed ? { ...agent, operations } : undefined
}

export const getQueryToolBindingsForResource = ({
  datasource,
  query,
}: {
  datasource: Datasource
  query: Query
}) => {
  if (!query._id) {
    throw new Error("Cannot generate query tool bindings without a query ID")
  }
  const sourceType: QueryToolType =
    datasource.source === SourceName.REST
      ? ToolType.REST_QUERY
      : ToolType.DATASOURCE_QUERY
  return getQueryToolBindings({
    sourceType,
    sourceLabel:
      datasource.name ||
      (sourceType === ToolType.REST_QUERY ? "API" : "Datasource"),
    queryName: query.name,
    queryId: query._id,
  })
}

export const migrateQueryToolReferences = async (
  migrations: QueryToolReferenceMigration | QueryToolReferenceMigration[]
): Promise<Agent[]> => {
  const bindingMigrations = (
    Array.isArray(migrations) ? migrations : [migrations]
  ).map(migration => ({
    existingBindings: getQueryToolBindingsForResource({
      datasource: migration.existingDatasource,
      query: migration.existingQuery,
    }),
    updatedBindings: getQueryToolBindingsForResource({
      datasource: migration.updatedDatasource,
      query: migration.updatedQuery,
    }),
  }))

  if (!bindingMigrations.length) {
    return []
  }

  const agents = await fetch()
  const referencingAgents: Agent[] = []
  for (const agent of agents) {
    let updatedAgent: Agent | undefined
    let currentAgent = agent
    let referencesQuery = false
    for (const bindingMigration of bindingMigrations) {
      referencesQuery ||=
        agentReferencesQueryTool({
          agent,
          bindings: bindingMigration.existingBindings,
        }) ||
        agentReferencesRuntimeTool({
          agent,
          runtimeBinding: bindingMigration.updatedBindings.runtimeBinding,
        })
      const result = updateAgentQueryToolReferences({
        agent: currentAgent,
        ...bindingMigration,
      })
      if (result) {
        currentAgent = result
        updatedAgent = result
      }
    }
    if (updatedAgent) {
      updatedAgent = await update(updatedAgent)
    }
    if (referencesQuery) {
      referencingAgents.push(updatedAgent || agent)
    }
  }
  return referencingAgents
}
