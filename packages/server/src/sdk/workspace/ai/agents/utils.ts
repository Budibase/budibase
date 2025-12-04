import { createToolSource } from "../../../../ai/tools/base/ToolSourceRegistry"
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
  const allTools: Tool[] = []
  const toolGuidelineEntries: { toolName: string; guidelines: string }[] = []

  for (const toolSource of agent.allowedTools || []) {
    const toolSourceInstance = createToolSource(toolSource)

    if (!toolSourceInstance) {
      continue
    }

    const guidelines = toolSourceInstance.getGuidelines()
    if (guidelines) {
      toolGuidelineEntries.push({
        toolName: toolSourceInstance.getName(),
        guidelines,
      })
    }
    const toolsToAdd = await toolSourceInstance.getEnabledToolsAsync()
    if (toolsToAdd.length > 0) {
      allTools.push(...toolsToAdd)
    }
  }

  const toolGuidelines =
    ai.composeAutomationAgentToolGuidelines(toolGuidelineEntries)

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

export function createLiteLLMFetch(sessionId: string) {
  return (
    input: Parameters<typeof fetch>[0],
    init?: Parameters<typeof fetch>[1]
  ) => {
    if (typeof init?.body === "string") {
      try {
        const body = JSON.parse(init.body)
        body.litellm_session_id = sessionId
        return fetch(input, { ...init, body: JSON.stringify(body) })
      } catch {
        // Not JSON, pass through
      }
    }
    return fetch(input, init)
  }
}
