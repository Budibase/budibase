import { ai } from "@budibase/pro"
import * as automationUtils from "../../automationUtils"
import {
  ClassifyContentStepInputs,
  ClassifyContentStepOutputs,
} from "@budibase/types"

export async function run({
  inputs,
}: {
  inputs: ClassifyContentStepInputs
}): Promise<ClassifyContentStepOutputs> {
  if (
    !inputs.textInput ||
    !inputs.categories ||
    inputs.categories.length === 0
  ) {
    return {
      success: false,
      response:
        "Classify Text AI Step Failed: Text Input and Categories (non-empty) are required.",
    }
  }

  try {
    const llm = await ai.getLLMOrThrow()
    const request = ai.classifyText(
      inputs.textInput,
      inputs.categories.split(",")
    )

    const llmResponse = await llm.prompt(request)
    const determinedCategory = llmResponse?.message?.trim()

    if (determinedCategory && inputs.categories.includes(determinedCategory)) {
      return {
        category: determinedCategory,
        success: true,
      }
    } else if (determinedCategory) {
      return {
        success: false,
        response: `Classify Text AI Step Failed: AI returned category '${determinedCategory}', which is not in the provided list: [${inputs.categories}]. Ensure the AI is constrained to the list or check AI response variability.`,
      }
    } else {
      return {
        success: false,
        response: "Classify Text AI Step Failed: AI did not return a category.",
      }
    }
  } catch (err: any) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
