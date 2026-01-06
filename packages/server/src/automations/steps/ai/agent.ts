import * as automationUtils from "../../automationUtils"
import {
  AgentStepInputs,
  AgentStepOutputs,
  AutomationStepInputBase,
} from "@budibase/types"
import { ai } from "@budibase/pro"
import sdk from "../../../sdk"
import { ToolLoopAgent, stepCountIs, Output } from "ai"
import { v4 } from "uuid"
import { isProdWorkspaceID } from "../../../db/utils"
import { z } from "zod"

function jsonSchemaToZod(schema: Record<string, any>) {
  const shape: Record<string, z.ZodType<any>> = {}
  for (const [key, value] of Object.entries(schema)) {
    const type = (value as any).type || "string"
    switch (type) {
      case "string":
        shape[key] = z.string()
        break
      case "number":
        shape[key] = z.number()
        break
      case "boolean":
        shape[key] = z.boolean()
        break
      case "object":
        shape[key] = z.record(z.string(), z.any())
        break
      case "array":
        shape[key] = z.array(z.any())
        break
      default:
        shape[key] = z.any()
    }
  }
  return z.object(shape)
}

export async function run({
  inputs,
  appId,
}: {
  inputs: AgentStepInputs
} & AutomationStepInputBase): Promise<AgentStepOutputs> {
  const { agentId, prompt, useStructuredOutput, outputSchema } = inputs

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

    let outputOption = undefined
    if (
      useStructuredOutput &&
      outputSchema &&
      Object.keys(outputSchema).length > 0
    ) {
      const zodSchema = jsonSchemaToZod(outputSchema)
      outputOption = Output.object({ schema: zodSchema })
    }

    const agent = new ToolLoopAgent({
      model: litellm.chat(modelId),
      instructions: systemPrompt || undefined,
      tools,
      stopWhen: stepCountIs(30),
      providerOptions: {
        litellm: ai.getLiteLLMProviderOptions(modelName),
      },
      output: outputOption,
    })

    const result = await agent.generate({
      prompt,
    })

    const steps = sdk.ai.agents.attachReasoningToSteps(result.steps)

    return {
      success: true,
      response: result.text,
      steps,
      output: result.output,
    }
  } catch (err: any) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
