import { AgentToolSource } from "@budibase/types"
import { ToolSource } from "./ToolSource"
import { BudibaseToolSource } from "./BudibaseToolSource"
import { GitHubToolSource } from "./GitHubToolSource"
import { ConfluenceToolSource } from "./ConfluenceToolSource"
import { BambooHRToolSource } from "./BambooHRToolSource"

type ToolSourceConstructor = new (toolSource: AgentToolSource) => ToolSource

const registry: Record<string, ToolSourceConstructor> = {
  BUDIBASE: BudibaseToolSource,
  GITHUB: GitHubToolSource,
  CONFLUENCE: ConfluenceToolSource,
  BAMBOOHR: BambooHRToolSource,
}

/**
 * Create a tool source instance for the given type
 */
export function createToolSource(
  toolSource: AgentToolSource
): ToolSource | null {
  const ToolSourceClass = registry[toolSource.type]
  if (!ToolSourceClass) {
    console.warn(`Unknown tool source type: ${toolSource.type}`)
    return null
  }

  return new ToolSourceClass(toolSource)
}
