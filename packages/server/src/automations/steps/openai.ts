import { OpenAIStepInputs, OpenAIStepOutputs } from "@budibase/types"
import * as automationUtils from "../automationUtils"
import { promptWithDefaultLLM } from "./ai/llm"

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
    const response = await promptWithDefaultLLM([
      {
        role: "user",
        content: inputs.prompt,
      },
    ])
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
