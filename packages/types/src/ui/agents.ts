import { ToolMetadata } from "../documents"

export interface EnrichedTool extends ToolMetadata {
  readableBinding: string
  runtimeBinding: string
  icon?: { url?: string; icon?: any }
}
