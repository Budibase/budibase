import {
  getQueryToolBindings,
  getReadableAgentToolBinding,
  type QueryToolType,
} from "@budibase/shared-core"
import { SourceName, ToolType } from "@budibase/types"
import type {
  Agent,
  AgentOperationToolConfig,
  Datasource,
  Query,
  Table,
} from "@budibase/types"
import { getBudibaseTools } from "../../../../ai/tools/budibase"
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

const replaceReadableBinding = (
  promptInstructions: string | undefined,
  existingBinding: string,
  updatedBinding: string
) => {
  if (!promptInstructions || existingBinding === updatedBinding) {
    return promptInstructions
  }

  const bindingRegex = new RegExp(
    `(\\{\\{\\s*)${escapeRegExp(existingBinding)}(\\s*\\}\\})`,
    "g"
  )
  return promptInstructions.replace(
    bindingRegex,
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

const getBindings = ({
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
): Promise<void> => {
  const bindingChanges = (Array.isArray(migrations) ? migrations : [migrations])
    .map(migration => ({
      existingBindings: getBindings({
        datasource: migration.existingDatasource,
        query: migration.existingQuery,
      }),
      updatedBindings: getBindings({
        datasource: migration.updatedDatasource,
        query: migration.updatedQuery,
      }),
    }))
    .filter(
      ({ existingBindings, updatedBindings }) =>
        existingBindings.readableBinding !== updatedBindings.readableBinding ||
        existingBindings.runtimeBinding !== updatedBindings.runtimeBinding
    )

  await migrateToolReferences(bindingChanges)
}

const migrateToolReferences = async (
  bindingChanges: Array<{
    existingBindings: ToolBindings
    updatedBindings: ToolBindings
  }>
) => {
  if (!bindingChanges.length) {
    return
  }

  const agents = await fetch()
  for (const agent of agents) {
    let updatedAgent: Agent | undefined
    let currentAgent = agent
    for (const bindingChange of bindingChanges) {
      const result = updateAgentQueryToolReferences({
        agent: currentAgent,
        ...bindingChange,
      })
      if (result) {
        currentAgent = result
        updatedAgent = result
      }
    }
    if (updatedAgent) {
      await update(updatedAgent)
    }
  }
}

export const migrateExternalTableToolReferences = async ({
  existingDatasource,
  updatedDatasource,
  tables,
}: {
  existingDatasource: Datasource
  updatedDatasource: Datasource
  tables: Table[]
}): Promise<void> => {
  if (!existingDatasource._id || !updatedDatasource._id) {
    throw new Error("Cannot migrate table tools without a datasource ID")
  }

  const getBindings = (datasource: Datasource) =>
    getBudibaseTools(tables, {
      [datasource._id!]: datasource.name || "External",
    })
      .filter(tool => tool.sourceType === ToolType.EXTERNAL_TABLE)
      .map(tool => ({
        readableBinding: getReadableAgentToolBinding({
          sourceType: tool.sourceType,
          sourceLabel: tool.sourceLabel,
          toolName: tool.readableName || tool.name,
        }),
        runtimeBinding: tool.name,
      }))

  const existingBindings = getBindings(existingDatasource)
  const updatedBindingsByRuntime = new Map(
    getBindings(updatedDatasource).map(binding => [
      binding.runtimeBinding,
      binding,
    ])
  )
  const bindingChanges = existingBindings.flatMap(existingBinding => {
    const updatedBinding = updatedBindingsByRuntime.get(
      existingBinding.runtimeBinding
    )
    return updatedBinding &&
      existingBinding.readableBinding !== updatedBinding.readableBinding
      ? [{ existingBindings: existingBinding, updatedBindings: updatedBinding }]
      : []
  })

  await migrateToolReferences(bindingChanges)
}
