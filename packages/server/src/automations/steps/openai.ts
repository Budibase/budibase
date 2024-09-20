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
  GPT_35_TURBO = "gpt-3.5-turbo",
  // will only work with api keys that have access to the GPT4 API
  GPT_4 = "gpt-4",
  GPT_4O = "gpt-4o",
  GPT_4O_MINI = "gpt-4o-mini",
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

    if (budibaseAIEnabled || customConfigsEnabled) {
      const llm = await pro.ai.LargeLanguageModel.forCurrentTenant(inputs.model)
      response = await llm.run(inputs.prompt)
    } else {
      // fallback to the default that uses the environment variable for backwards compat
      if (!env.OPENAI_API_KEY) {
        return {
          success: false,
          response:
            "OpenAI API Key not configured - please add the OPENAI_API_KEY environment variable.",
        }
      }
      response = await legacyOpenAIPrompt(inputs)
    }

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
