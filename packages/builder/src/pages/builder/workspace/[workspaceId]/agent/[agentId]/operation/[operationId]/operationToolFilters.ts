import { ToolType } from "@budibase/types"
import type { AgentTool } from "../../toolTypes"

export const filterOperationTools = ({
  tools,
  toolSearch,
  escalationEnabled,
}: {
  tools: AgentTool[]
  toolSearch: string
  escalationEnabled: boolean
}) =>
  tools.filter(tool => {
    if (tool.sourceType === ToolType.ESCALATION && !escalationEnabled) {
      return false
    }
    const query = toolSearch.trim().toLowerCase()
    return (
      !query ||
      `${tool.sourceLabel || ""} ${tool.readableName || tool.name}`
        .toLowerCase()
        .includes(query)
    )
  })

export const groupToolsBySection = (tools: AgentTool[]) =>
  tools.reduce(
    (sections, tool) => {
      const section = tool.sourceLabel || "Tools"
      sections[section] ||= []
      sections[section].push(tool)
      return sections
    },
    {} as Record<string, AgentTool[]>
  )
