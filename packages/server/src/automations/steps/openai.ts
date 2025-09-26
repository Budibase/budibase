import { OpenAIStepInputs, OpenAIStepOutputs } from "@budibase/types"
import { env } from "@budibase/backend-core"
import * as automationUtils from "../automationUtils"
import { ai } from "@budibase/pro"
import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

/**
 * Maintains backward compatibility with automation steps created before the introduction
 * of custom configurations and Budibase AI
 * @param inputs - automation inputs from the OpenAI automation step.
 */
async function legacyOpenAIPrompt(inputs: OpenAIStepInputs) {
  const openai = createOpenAI({
    apiKey: env.OPENAI_API_KEY,
  })

  const response = await generateText({
    model: openai.chat(inputs.model),
    messages: [
      {
        role: "user",
        content: inputs.prompt,
      },
    ],
  })
  return response.text
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
    const llm = await ai.getLLM({ model: inputs.model })
    response = llm
      ? (await llm.prompt(inputs.prompt)).message
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
