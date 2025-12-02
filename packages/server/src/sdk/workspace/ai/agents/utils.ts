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

  const systemPrompt = ai.composeAutomationAgentSystemPrompt({
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

export function addRequestId(
  input: Parameters<typeof fetch>[0],
  init: Parameters<typeof fetch>[1],
  requestId: string
) {
  // we need to specifically add a litellm_session_id to the underlying request
  const nextInit = { ...init }

  if (typeof nextInit?.body === "string") {
    try {
      const body = JSON.parse(nextInit.body)
      body.litellm_session_id = requestId
      nextInit.body = JSON.stringify(body)
    } catch {
      // If the body is not JSON, send the request unmodified
    }
  }

  return fetch(input, nextInit)
}
