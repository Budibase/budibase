import type { ToolMetadata } from "@budibase/types"
import type { IconInfo } from "@/helpers/integrationIcons"

export interface AgentTool extends ToolMetadata {
  readableBinding: string
  runtimeBinding: string
  icon?: IconInfo
  tagIconUrl?: string
}
