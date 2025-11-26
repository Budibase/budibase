import * as automationUtils from "../../automationUtils"
import {
  AgentStepInputs,
  AgentStepOutputs,
  AgentToolSource,
  Tool,
} from "@budibase/types"
import sdk from "../../../sdk"
import { createToolSource as createToolSourceInstance } from "../../../ai/tools/base"
import { toAiSdkTools } from "../../../ai/tools/toAiSdkTools"
import { createOpenAI } from "@ai-sdk/openai"
import {
  Experimental_Agent as Agent,
  extractReasoningMiddleware,
  stepCountIs,
  wrapLanguageModel,
} from "ai"

export async function run({
  inputs,
}: {
  inputs: AgentStepInputs
}): Promise<AgentStepOutputs> {
  const { agentId, prompt } = inputs

  if (!agentId) {
    return {
      success: false,
      response: "Agent step failed: No agent selected",
    }
  }

  if (!prompt) {
    return {
      success: false,
      response: "Agent step failed: No prompt provided",
    }
  }

  try {
    const agentConfig = await sdk.ai.agents.getOrThrow(agentId)

    // Build system prompt from agent configuration
    let system = ""
    if (agentConfig.promptInstructions) {
      system += agentConfig.promptInstructions
    }
    if (agentConfig.goal) {
      system += `\n\nYour goal: ${agentConfig.goal}`
    }

    // Collect tools from all tool sources
    let toolGuidelines = ""
    const allTools: Tool[] = []

    for (const toolSource of agentConfig.allowedTools || []) {
      const toolSourceInstance = createToolSourceInstance(
        toolSource as AgentToolSource
      )

      if (!toolSourceInstance) {
        continue
      }

      const guidelines = toolSourceInstance.getGuidelines()
      if (guidelines) {
        toolGuidelines += `\n\nWhen using ${toolSourceInstance.getName()} tools, ensure you follow these guidelines:\n${guidelines}`
      }

      const toolsToAdd = toolSourceInstance.getEnabledTools()
      if (toolsToAdd.length > 0) {
        allTools.push(...toolsToAdd)
      }
    }

    // Append tool guidelines to system prompt
    if (toolGuidelines) {
      system += toolGuidelines
    }

    // Get LLM configuration
    const { modelId, apiKey, baseUrl } =
      await sdk.aiConfigs.getLiteLLMModelConfigOrThrow()

    const openai = createOpenAI({
      apiKey,
      baseURL: baseUrl,
    })

    const aiTools = toAiSdkTools(allTools)

    extractReasoningMiddleware({
      tagName: "think",
    })

    const agent = new Agent({
      model: wrapLanguageModel({
        model: openai(modelId),
        middleware: extractReasoningMiddleware({
          tagName: "think",
        }),
      }),
      system: system || undefined,
      tools: aiTools,
      stopWhen: stepCountIs(10),
    })

    const result = await agent.generate({
      prompt,
    })

    return {
      success: true,
      response: result.text,
      steps: result.steps,
    }
  } catch (err: any) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
