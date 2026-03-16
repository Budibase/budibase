import { SummariseStepInputs, SummariseStepOutputs } from "@budibase/types"
import * as automationUtils from "../../automationUtils"
import { ai } from "@budibase/pro"
import { promptWithDefaultLLM } from "./llm"

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
