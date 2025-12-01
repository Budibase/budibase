import { createToolSource } from "packages/server/src/ai/tools/base/ToolSourceRegistry"
import { Agent, Tool } from "@budibase/types"

export async function buildPromptAndTools(agent: Agent): Promise<{
  systemPrompt: string
  tools: Tool[]
}> {
  let systemPrompt = ""

  if (agent.goal) {
    systemPrompt += `\n\nYour goal: ${agent.goal}`
  }

  let toolGuidelines = ""
  const allTools: Tool[] = []

  for (const toolSource of agent.allowedTools || []) {
    const toolSourceInstance = createToolSource(toolSource)

    if (!toolSourceInstance) {
      continue
    }

    const guidelines = toolSourceInstance.getGuidelines()
    if (guidelines) {
      toolGuidelines += `\n\nWhen using ${toolSourceInstance.getName()} tools, ensure you follow these guidelines:\n${guidelines}`
    }

    const toolsToAdd = await toolSourceInstance.getEnabledToolsAsync()
    if (toolsToAdd.length > 0) {
      allTools.push(...toolsToAdd)
    }
  }

  if (toolGuidelines) {
    systemPrompt += `\n\n${toolGuidelines}`
  }

  return {
    systemPrompt,
    tools: allTools,
  }
}
