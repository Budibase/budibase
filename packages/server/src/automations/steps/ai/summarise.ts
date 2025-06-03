import { SummariseStepInputs, SummariseStepOutputs } from "@budibase/types"
import * as automationUtils from "../../automationUtils"
import { ai } from "@budibase/pro"

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
    const llm = await ai.getLLMOrThrow()
    const request = ai.summarizeText(inputs.text, inputs.length)

    const response = await llm?.prompt(request)
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
