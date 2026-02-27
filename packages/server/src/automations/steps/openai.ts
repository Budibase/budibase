import { OpenAIStepInputs, OpenAIStepOutputs } from "@budibase/types"
import * as automationUtils from "../automationUtils"
import { ai } from "@budibase/pro"
import { promptWithDefaultLLM } from "./ai/llm"

export async function run({
  inputs,
}: {
  inputs: OpenAIStepInputs
}): Promise<OpenAIStepOutputs> {
  if (!inputs.prompt?.trim()) {
    return {
      success: false,
      response: "Budibase OpenAI Automation Failed: No prompt supplied",
    }
  }

  try {
    const request = new ai.LLMRequest().addUserMessage(inputs.prompt)
    const response = await promptWithDefaultLLM(request.messages)
    return {
      response,
      success: true,
    }
  } catch (err) {
    const error = automationUtils.getError(err)
    const response = error.includes("Invalid JSON response")
      ? "Error: No response found"
      : error

    return {
      success: false,
      response,
    }
  }
}
