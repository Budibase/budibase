import { OpenAIStepInputs, OpenAIStepOutputs } from "@budibase/types"
import * as automationUtils from "../automationUtils"
import { ai } from "@budibase/pro"
import { promptWithDefaultLLM } from "./ai/llm"

export async function run({
  inputs,
}: {
  inputs: OpenAIStepInputs
}): Promise<OpenAIStepOutputs> {
  if (inputs.prompt == null || inputs.prompt.trim()) {
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
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
