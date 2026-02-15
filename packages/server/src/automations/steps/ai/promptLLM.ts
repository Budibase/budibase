import { generateText } from "ai"
import { PromptLLMStepInputs, PromptLLMStepOutputs } from "@budibase/types"
import * as automationUtils from "../../automationUtils"
import sdk from "../../../sdk"

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
    const llm = await sdk.ai.llm.getDefaultLLMOrThrow()
    const response = await generateText({
      model: llm.chat,
      messages: [{ role: "user", content: inputs.prompt }],
      providerOptions: llm.providerOptions?.(false),
    })
    return {
      response: response.text,
      success: true,
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
