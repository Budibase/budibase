import { Automation, TableSourceType, type Table } from "@budibase/types"
import type { AiToolDefinition } from ".."
import createAutomationTools from "./automations"
import { createRowTools } from "./rows"
import {
  createKnowledgeFilesTool,
  createKnowledgeSearchTool,
} from "./knowledgeFiles"

export interface BudibaseToolDefinition extends AiToolDefinition {
  sourceLabel: string
}

export const getBudibaseTools = (
  tables: Table[] = [],
  datasourceNamesById: Record<string, string> = {},
  datasourceIconTypesById: Record<string, string> = {},
  automations: Automation[] = []
): BudibaseToolDefinition[] => {
  const baseTools = createAutomationTools(automations)

  const rowTools = tables
    .filter(table => table._id)
    .flatMap(table => {
      const isExternal = table.sourceType === TableSourceType.EXTERNAL
      return createRowTools({
        tableId: table._id!,
        tableName: table.name || table._id!,
        tableSourceType: table.sourceType,
        tableSchema: table.schema,
        sourceLabel: isExternal
          ? datasourceNamesById[table.sourceId] || "External"
          : "Budibase",
        sourceId: isExternal ? table.sourceId : undefined,
        sourceIconType: isExternal
          ? datasourceIconTypesById[table.sourceId]
          : undefined,
      })
    })

  return [...baseTools, ...rowTools]
}

export default getBudibaseTools
export { createTableTools } from "./tables"
export { createKnowledgeFilesTool, createKnowledgeSearchTool }
export { createEscalatePlaceholderTool, createEscalateTool } from "./escalate"
