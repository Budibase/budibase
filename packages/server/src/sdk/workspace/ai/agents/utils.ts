import { createToolSource } from "../../../../ai/tools/base/ToolSourceRegistry"
import { Agent, Tool } from "@budibase/types"
import { ai } from "@budibase/pro"
import type { StepResult, ToolSet } from "ai"

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

export const extractReasoningTextFromStep = (
  step: StepResult<ToolSet>
): string | undefined => {
  const existing = step.reasoningText
  if (existing && existing.trim().length > 0) {
    return existing
  }

  const body = step.response?.body
  if (!body || typeof body !== "object" || !("choices" in body)) {
    return undefined
  }

  try {
    const choices = body.choices
    if (!Array.isArray(choices) || choices.length === 0) {
      return undefined
    }
    const message = choices[0]?.message
    const reasoning = message?.reasoning
    if (typeof reasoning === "string" && reasoning.trim().length > 0) {
      return reasoning
    }
  } catch (error) {
    console.log("Error extracting reasoning text from step: ", error)
  }

  return undefined
}

export const attachReasoningToSteps = (
  steps?: Array<StepResult<ToolSet>>
): Array<StepResult<ToolSet>> | undefined => {
  if (!steps || steps.length === 0) {
    return steps
  }

  return steps.map(step => {
    const reasoningText = extractReasoningTextFromStep(step)
    if (!reasoningText) {
      return step
    }
    return {
      ...step,
      reasoningText,
    }
  })
}
