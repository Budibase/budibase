import {
  Automation,
  TableSourceType,
  type PlatformActionResourceOrigin,
  type Table,
} from "@budibase/types"
import { helpers } from "@budibase/shared-core"
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
  automations: Automation[] = [],
  triggeredBy?: PlatformActionResourceOrigin
): BudibaseToolDefinition[] => {
  const baseTools = createAutomationTools({ automations, triggeredBy })

  const rowTools = tables
    .filter(table => table._id)
    .flatMap(table => {
      const isExternal = table.sourceType === TableSourceType.EXTERNAL
      const tableTools = createRowTools({
        tableId: table._id!,
        tableName: table.name || table._id!,
        tableSourceType: table.sourceType,
        tableSchema: table.schema,
        primaryDisplay: table.primaryDisplay,
        sourceLabel: isExternal
          ? datasourceNamesById[table.sourceId] || "External"
          : "Budibase",
        sourceIconType: isExternal
          ? datasourceIconTypesById[table.sourceId]
          : undefined,
      })
      if (isExternal) {
        return tableTools
      }
      const viewTools = Object.values(table.views || {})
        .filter(helpers.views.isV2)
        .filter(view => !helpers.views.isCalculationView(view))
        .flatMap(view =>
          createRowTools({
            tableId: view.id,
            tableName: `${table.name} / ${view.name}`,
            tableSourceType: table.sourceType,
            tableSchema: Object.fromEntries(
              Object.entries(table.schema).filter(
                ([name, field]) =>
                  view.schema?.[name] &&
                  helpers.views.isVisible(view.schema[name]) &&
                  field.visible !== false
              )
            ),
            primaryDisplay: view.primaryDisplay,
            view,
          })
        )
      return [...tableTools, ...viewTools]
    })

  return [...baseTools, ...rowTools]
}

export default getBudibaseTools
export { createTableTools } from "./tables"
export { createKnowledgeFilesTool, createKnowledgeSearchTool }
