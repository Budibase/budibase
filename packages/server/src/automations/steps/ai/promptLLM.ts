import { PromptLLMStepInputs, PromptLLMStepOutputs } from "@budibase/types"
import * as automationUtils from "../../automationUtils"
import { ai } from "@budibase/pro"

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
    const llm = await ai.getLLM()
    const response = await llm?.prompt(inputs.prompt)
    return {
      response: response?.message,
      success: true,
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
