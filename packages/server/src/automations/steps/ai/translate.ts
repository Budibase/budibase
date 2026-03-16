import { TranslateStepInputs, TranslateStepOutputs } from "@budibase/types"
import * as automationUtils from "../../automationUtils"
import { ai } from "@budibase/pro"
import { promptWithDefaultLLM } from "./llm"

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
    const request = ai.translate(inputs.text, inputs.language)
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
