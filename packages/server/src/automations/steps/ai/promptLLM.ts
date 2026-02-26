import { PromptLLMStepInputs, PromptLLMStepOutputs } from "@budibase/types"
import * as automationUtils from "../../automationUtils"
import { ai } from "@budibase/pro"
import { promptWithDefaultLLM } from "./llm"

export async function run({
  inputs,
}: {
  inputs: PromptLLMStepInputs
}): Promise<PromptLLMStepOutputs> {
  if (inputs.prompt == null) {
    return {
      success: false,
      response: "No prompt supplied",
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
