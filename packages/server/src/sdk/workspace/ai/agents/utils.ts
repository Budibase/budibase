import { createToolSource } from "packages/server/src/ai/tools/base/ToolSourceRegistry"
import { Agent, Tool } from "@budibase/types"
import { ai } from "@budibase/pro"

export interface BuildPromptAndToolsOptions {
  baseSystemPrompt?: string
  includeGoal?: boolean
}

export async function buildPromptAndTools(
  agent: Agent,
  options: BuildPromptAndToolsOptions = {}
): Promise<{
  systemPrompt: string
  tools: Tool[]
}> {
  const { baseSystemPrompt, includeGoal = true } = options

  let toolGuidelines = ""
  const allTools: Tool[] = []

  for (const toolSource of agent.allowedTools || []) {
    const toolSourceInstance = createToolSource(toolSource)

    if (!toolSourceInstance) {
      continue
    }

    const guidelines = toolSourceInstance.getGuidelines()
    if (guidelines) {
      const prefix = `When using ${toolSourceInstance.getName()} tools, ensure you follow these guidelines:\n${guidelines}`
      toolGuidelines += toolGuidelines ? `\n\n${prefix}` : prefix
    }

    const toolsToAdd = await toolSourceInstance.getEnabledToolsAsync()
    if (toolsToAdd.length > 0) {
      allTools.push(...toolsToAdd)
    }
  }

  const systemPrompt = ai.composeAgentSystemPrompt({
    baseSystemPrompt,
    goal: includeGoal ? agent.goal : undefined,
    promptInstructions: agent.promptInstructions,
    toolGuidelines,
    includeGoal,
  })

  return {
    systemPrompt,
    tools: allTools,
  }
}
