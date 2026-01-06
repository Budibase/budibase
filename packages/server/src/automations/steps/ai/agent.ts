import * as automationUtils from "../../automationUtils"
import {
  AgentStepInputs,
  AgentStepOutputs,
  AutomationStepInputBase,
} from "@budibase/types"
import { ai } from "@budibase/pro"
import sdk from "../../../sdk"
import { ToolLoopAgent, stepCountIs } from "ai"
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

    const { systemPrompt, tools } =
      await sdk.ai.agents.buildPromptAndTools(agentConfig)

    const { modelId, apiKey, baseUrl, modelName } =
      await sdk.aiConfigs.getLiteLLMModelConfigOrThrow(agentConfig.aiconfig)

    const litellm = ai.createLiteLLMOpenAI({
      apiKey,
      baseUrl,
      fetch: sdk.ai.agents.createLiteLLMFetch(v4()),
    })

    const agent = new ToolLoopAgent({
      model: litellm.chat(modelId),
      instructions: systemPrompt || undefined,
      tools,

      stopWhen: stepCountIs(30),
      providerOptions: {
        litellm: ai.getLiteLLMProviderOptions(modelName),
      },
    })

    const result = await agent.generate({
      prompt,
    })

    const steps = sdk.ai.agents.attachReasoningToSteps(result.steps)

    return {
      success: true,
      response: result.text,
      steps,
    }
  } catch (err: any) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
