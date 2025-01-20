import { OpenAI } from "openai"

import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  OpenAIStepInputs,
  OpenAIStepOutputs,
} from "@budibase/types"
import { env } from "@budibase/backend-core"
import * as automationUtils from "../automationUtils"
import * as pro from "@budibase/pro"

enum Model {
  GPT_4O_MINI = "gpt-4o-mini",
  GPT_4O = "gpt-4o",
  GPT_4 = "gpt-4",
  GPT_35_TURBO = "gpt-3.5-turbo",
}

export const definition: AutomationStepDefinition = {
  name: "OpenAI",
  tagline: "Send prompts to ChatGPT",
  icon: "Algorithm",
  description: "Interact with the OpenAI ChatGPT API.",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.OPENAI,
  inputs: {
    prompt: "",
  },
  schema: {
    inputs: {
      properties: {
        prompt: {
          type: AutomationIOType.STRING,
          title: "Prompt",
        },
        model: {
          type: AutomationIOType.STRING,
          title: "Model",
          enum: Object.values(Model),
        },
      },
      required: ["prompt", "model"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
        response: {
          type: AutomationIOType.STRING,
          description: "What was output",
        },
      },
      required: ["success", "response"],
    },
  },
}

/**
 * Maintains backward compatibility with automation steps created before the introduction
 * of custom configurations and Budibase AI
 * @param inputs - automation inputs from the OpenAI automation step.
 */
async function legacyOpenAIPrompt(inputs: OpenAIStepInputs) {
  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  })

  const completion = await openai.chat.completions.create({
    model: inputs.model,
    messages: [
      {
        role: "user",
        content: inputs.prompt,
      },
    ],
  })
  return completion?.choices[0]?.message?.content
}

export async function run({
  inputs,
}: {
  inputs: OpenAIStepInputs
}): Promise<OpenAIStepOutputs> {
  if (inputs.prompt == null) {
    return {
      success: false,
      response: "Budibase OpenAI Automation Failed: No prompt supplied",
    }
  }

  try {
    let response
    const customConfigsEnabled = await pro.features.isAICustomConfigsEnabled()
    const budibaseAIEnabled = await pro.features.isBudibaseAIEnabled()

    let llmWrapper
    if (budibaseAIEnabled || customConfigsEnabled) {
      llmWrapper = await pro.ai.LargeLanguageModel.forCurrentTenant(
        inputs.model
      )
    }

    response = llmWrapper?.llm
      ? await llmWrapper.run(inputs.prompt)
      : await legacyOpenAIPrompt(inputs)

    return {
      response,
      success: true,
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
