import { ToolMetadata } from "../documents"

export interface EnrichedTool extends ToolMetadata {
  readableBinding: string
  runtimeBinding: string
  icon?: { url?: string; icon?: any }
}

// For the UI driving Deployments such as discord etc.
export interface DeploymentRow {
  id: string
  name: string
  logo: string
  status: "Enabled" | "Disabled"
  details: string
  configurable?: boolean
}
