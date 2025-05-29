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
    !inputs.categoryItems ||
    inputs.categoryItems.length === 0
  ) {
    return {
      success: false,
      response:
        "Classify Text AI Step Failed: Text Input and Categories (non-empty) are required.",
    }
  }

  try {
    const llm = await ai.getLLMOrThrow()

    const categories = inputs.categoryItems!.map(item => item.category)

    const request = ai.classifyText(inputs.textInput, categories)

    const llmResponse = await llm.prompt(request)
    const determinedCategory = llmResponse?.message?.trim()

    if (determinedCategory && categories.includes(determinedCategory)) {
      return {
        response: determinedCategory,
        success: true,
      }
    }

    if (determinedCategory) {
      return {
        success: false,
        response: `Classify Text AI Step Failed: AI returned category '${determinedCategory}', which is not in the provided list: [${categories.join(
          ", "
        )}]. Ensure the AI is constrained to the list or check AI response variability.`,
      }
    }

    return {
      success: false,
      response: "Classify Text AI Step Failed: AI did not return a category.",
    }
  } catch (err: any) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
