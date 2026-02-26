import { OpenAI } from "openai"

import { OpenAIStepInputs, OpenAIStepOutputs } from "@budibase/types"
import { env } from "@budibase/backend-core"
import * as automationUtils from "../automationUtils"
import { ai } from "@budibase/pro"

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
