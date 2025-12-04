import { AgentToolSource } from "@budibase/types"
import { ToolSource } from "./ToolSource"
import { BudibaseToolSource } from "./BudibaseToolSource"
import { RestQueryToolSource } from "./RestQueryToolSource"

type ToolSourceConstructor = new (toolSource: AgentToolSource) => ToolSource

const registry: Record<string, ToolSourceConstructor> = {
  BUDIBASE: BudibaseToolSource,
  REST_QUERY: RestQueryToolSource,
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
