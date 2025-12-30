import type { Tool } from "ai"
import type { ToolType } from "@budibase/types"

import AUTOMATION_TOOLS from "./automations"
import TABLE_TOOLS from "./tables"
import ROW_TOOLS from "./rows"

export interface BudibaseToolDefinition {
  name: string
  sourceType: ToolType
  sourceLabel: string
  description: string
  tool: Tool
}

const BUDIBASE_TOOLS: BudibaseToolDefinition[] = [
  ...AUTOMATION_TOOLS,
  ...TABLE_TOOLS,
  ...ROW_TOOLS,
]

export default BUDIBASE_TOOLS
