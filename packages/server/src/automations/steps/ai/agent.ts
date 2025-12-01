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
import { v4 } from "uuid"

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

    const { systemPrompt, tools: allTools } =
      await sdk.ai.agents.buildPromptAndTools(agentConfig)

    // Get LLM configuration
    const { modelId, apiKey, baseUrl } =
      await sdk.aiConfigs.getLiteLLMModelConfigOrThrow()

    const requestId = v4()
    const openai = createOpenAI({
      apiKey,
      baseURL: baseUrl,
      fetch: async (input, init) => {
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
      },
    })

    const aiTools = toAiSdkTools(allTools)
    const agent = new Agent({
      model: wrapLanguageModel({
        model: openai.chat(modelId),
        middleware: extractReasoningMiddleware({
          tagName: "think",
        }),
      }),
      system: systemPrompt || undefined,
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
