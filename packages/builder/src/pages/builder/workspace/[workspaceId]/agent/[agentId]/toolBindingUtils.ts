import {
  ToolExecutionPrincipal,
  ToolType,
  type AgentOperation,
} from "@budibase/types"
import type { AgentTool } from "./toolTypes"

const normaliseBinding = (binding: string) =>
  binding
    .replace(/^\s*\{\{\s*/, "")
    .replace(/\s*\}\}\s*$/, "")
    .trim()

export const getToolBindingCategory = (
  sourceType: ToolType | undefined,
  sourceLabel?: string
) => {
  if (sourceType === ToolType.INTERNAL_TABLE) {
    return "Budibase"
  }
  if (sourceType === ToolType.AUTOMATION) {
    return "Automations"
  }
  if (sourceType === ToolType.EXTERNAL_TABLE) {
    return sourceLabel || "External"
  }
  if (sourceType === ToolType.SEARCH) {
    return sourceLabel || "Search tools"
  }
  if (sourceType === ToolType.REST_QUERY) {
    return sourceLabel || "API tools"
  }
  if (sourceType === ToolType.DATASOURCE_QUERY) {
    return sourceLabel || "Datasource tools"
  }
  if (sourceType === ToolType.ESCALATION) {
    return "Escalation"
  }
  return "Tools"
}

export const getIncludedToolRuntimeBindings = (
  prompt: string | undefined | null,
  bindingsMap: Record<string, string>
) => {
  const matches = (prompt || "").match(/\{\{\s*[^{}]+\s*\}\}/g) || []
  return Array.from(
    new Set(
      matches
        .map(normaliseBinding)
        .map(binding => bindingsMap[binding])
        .filter(Boolean)
    )
  )
}

export const getConfiguredOperationTools = ({
  operation,
  readableToRuntimeBinding,
  availableTools,
  toolSecurityEnabled,
}: {
  operation: AgentOperation
  readableToRuntimeBinding: Record<string, string>
  availableTools: AgentTool[]
  toolSecurityEnabled: boolean
}) => {
  const existing = new Map(
    (operation.enabledTools || []).map(tool => [tool.toolName, tool])
  )

  return getIncludedToolRuntimeBindings(
    operation.promptInstructions,
    readableToRuntimeBinding
  ).map(toolName => {
    const tool = availableTools.find(item => item.runtimeBinding === toolName)
    const existingConfig = existing.get(toolName)
    let executionPrincipal =
      existingConfig?.executionPrincipal ?? ToolExecutionPrincipal.REQUESTER

    if (!toolSecurityEnabled) {
      executionPrincipal =
        existingConfig?.executionPrincipal ?? ToolExecutionPrincipal.ADMIN
    } else if (tool?.executionPolicy.mode === "admin") {
      executionPrincipal = ToolExecutionPrincipal.ADMIN
    } else if (tool?.executionPolicy.mode === "configurable") {
      executionPrincipal =
        existingConfig?.executionPrincipal ??
        tool.executionPolicy.defaultPrincipal
    }

    return {
      ...existingConfig,
      toolName,
      executionPrincipal,
    }
  })
}
