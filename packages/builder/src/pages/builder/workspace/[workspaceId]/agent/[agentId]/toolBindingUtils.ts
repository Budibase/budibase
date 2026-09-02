import { ToolExecutionPrincipal, type AgentOperation } from "@budibase/types"
import type { AgentTool } from "./toolTypes"

export const normalizeConfiguredOperationTools = ({
  operation,
  availableTools,
}: {
  operation: AgentOperation
  availableTools: AgentTool[]
}) => {
  return (operation.enabledTools || []).map(config => {
    const tool = availableTools.find(
      item => item.runtimeBinding === config.toolName
    )
    if (!tool) {
      return config
    }
    return {
      ...config,
      executionPrincipal:
        tool.executionPolicy.mode === "admin"
          ? ToolExecutionPrincipal.ADMIN
          : config.executionPrincipal,
    }
  })
}

export const getDefaultToolExecutionPrincipal = (tool: AgentTool) => {
  if (tool.executionPolicy.mode === "admin") {
    return ToolExecutionPrincipal.ADMIN
  }
  return tool.executionPolicy.defaultPrincipal
}

export const isToolReferenced = ({
  prompt,
  tool,
}: {
  prompt?: string | null
  tool: Pick<AgentTool, "readableBinding">
}) => {
  if (!tool.readableBinding) {
    return false
  }
  const escapedBinding = tool.readableBinding.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  )
  return new RegExp(`\\{\\{\\s*${escapedBinding}\\s*\\}\\}`).test(prompt || "")
}
