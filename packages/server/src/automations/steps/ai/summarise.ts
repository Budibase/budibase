import { generateText } from "ai"
import { SummariseStepInputs, SummariseStepOutputs } from "@budibase/types"
import * as automationUtils from "../../automationUtils"
import { ai } from "@budibase/pro"
import sdk from "../../../sdk"

export async function run({
  inputs,
}: {
  inputs: SummariseStepInputs
}): Promise<SummariseStepOutputs> {
  if (inputs.text == null) {
    return {
      success: false,
      response: "No text supplied",
    }
  }

  try {
    const request = ai.summarizeText(inputs.text, inputs.length)
    const llm = await sdk.ai.llm.getDefaultLLMOrThrow()
    const response = await generateText({
      model: llm.chat,
      messages: request.messages,
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
