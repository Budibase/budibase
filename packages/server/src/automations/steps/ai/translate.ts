import { TranslateStepInputs, TranslateStepOutputs } from "@budibase/types"
import * as automationUtils from "../../automationUtils"
import { ai } from "@budibase/pro"

export async function run({
  inputs,
}: {
  inputs: TranslateStepInputs
}): Promise<TranslateStepOutputs> {
  if (inputs.text == null || inputs.language == null) {
    return {
      success: false,
      response: "No text or language supplied",
    }
  }

  try {
    const llm = await ai.getLLMOrThrow()
    const request = ai.translate(inputs.text, inputs.language)

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
