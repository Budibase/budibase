import { getQueryToolBindings, type QueryToolType } from "@budibase/shared-core"
import { SourceName, ToolType } from "@budibase/types"
import type { Agent, Datasource, Query } from "@budibase/types"
import { fetch, update } from "./crud"

interface QueryToolReferenceMigration {
  datasource: Datasource
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
  enabledTools: string[] | undefined,
  existingBinding: string,
  updatedBinding: string
) => {
  if (!enabledTools || existingBinding === updatedBinding) {
    return enabledTools
  }
  if (!enabledTools.includes(existingBinding)) {
    return enabledTools
  }

  return Array.from(
    new Set(
      enabledTools.map(binding =>
        binding === existingBinding ? updatedBinding : binding
      )
    )
  )
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

export const migrateQueryToolReferences = async ({
  datasource,
  existingQuery,
  updatedQuery,
}: QueryToolReferenceMigration): Promise<void> => {
  const sourceType: QueryToolType =
    datasource.source === SourceName.REST
      ? ToolType.REST_QUERY
      : ToolType.DATASOURCE_QUERY
  const bindingOptions = {
    sourceType,
    sourceLabel:
      datasource.name ||
      (sourceType === ToolType.REST_QUERY ? "API" : "Datasource"),
  }
  const existingBindings = getQueryToolBindings({
    ...bindingOptions,
    queryName: existingQuery.name,
  })
  const updatedBindings = getQueryToolBindings({
    ...bindingOptions,
    queryName: updatedQuery.name,
  })

  if (
    existingBindings.readableBinding === updatedBindings.readableBinding &&
    existingBindings.runtimeBinding === updatedBindings.runtimeBinding
  ) {
    return
  }

  const agents = await fetch()
  for (const agent of agents) {
    const updatedAgent = updateAgentQueryToolReferences({
      agent,
      existingBindings,
      updatedBindings,
    })
    if (updatedAgent) {
      await update(updatedAgent)
    }
  }
}
