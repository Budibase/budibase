import * as automationUtils from "../../automationUtils"
import {
  AgentStepInputs,
  AgentStepOutputs,
  AutomationStepInputBase,
} from "@budibase/types"
import { ai } from "@budibase/pro"
import sdk from "../../../sdk"
import { toAiSdkTools } from "../../../ai/tools/toAiSdkTools"
import {
  Experimental_Agent as Agent,
  extractReasoningMiddleware,
  stepCountIs,
  wrapLanguageModel,
} from "ai"
import { v4 } from "uuid"
import { isProdWorkspaceID } from "../../../db/utils"

export async function run({
  inputs,
  appId,
}: {
  inputs: AgentStepInputs
} & AutomationStepInputBase): Promise<AgentStepOutputs> {
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

    if (appId && isProdWorkspaceID(appId) && agentConfig.live !== true) {
      return {
        success: false,
        response:
          "Agent is paused. Set it live to use it in published automations.",
      }
    }

    const { systemPrompt, tools: allTools } =
      await sdk.ai.agents.buildPromptAndTools(agentConfig)

    const { modelId, apiKey, baseUrl } =
      await sdk.aiConfigs.getLiteLLMModelConfigOrThrow(agentConfig.aiconfig)

    const litellm = ai.createLiteLLMOpenAI({
      apiKey,
      baseUrl,
      fetch: sdk.ai.agents.createLiteLLMFetch(v4()),
    })

    const model = litellm.chat(modelId)
    const aiTools = toAiSdkTools(allTools)
    const agent = new Agent({
      model: wrapLanguageModel({
        model,
        middleware: extractReasoningMiddleware({
          tagName: "think",
        }),
      }),
      system: systemPrompt || undefined,
      tools: aiTools,
      stopWhen: stepCountIs(30),
    })

    const result = await agent.generate({
      prompt,
      providerOptions: {
        litellm: ai.getLiteLLMProviderOptions(modelId),
      },
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
