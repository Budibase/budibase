import { TableSourceType, type Table, type ToolType } from "@budibase/types"
import type { Tool } from "ai"
import AUTOMATION_TOOLS from "./automations"
import TABLE_TOOLS from "./tables"
import { createRowTools } from "./rows"

export interface BudibaseToolDefinition {
  name: string
  sourceType: ToolType
  sourceLabel: string
  sourceIconType?: string
  description: string
  tool: Tool
  readableName?: string
}

export const getBudibaseTools = (
  tables: Table[] = [],
  datasourceNamesById: Record<string, string> = {},
  datasourceIconTypesById: Record<string, string> = {}
): BudibaseToolDefinition[] => {
  const baseTools = [...AUTOMATION_TOOLS, ...TABLE_TOOLS]

  const rowTools = tables
    .filter(table => table._id)
    .flatMap(table => {
      const isExternal = table.sourceType === TableSourceType.EXTERNAL
      return createRowTools({
        tableId: table._id!,
        tableName: table.name || table._id!,
        tableSourceType: table.sourceType,
        sourceLabel: isExternal
          ? datasourceNamesById[table.sourceId] || "External"
          : "Budibase",
        sourceIconType: isExternal
          ? datasourceIconTypesById[table.sourceId]
          : undefined,
      })
    })

  return [...baseTools, ...rowTools]
}

export default getBudibaseTools
