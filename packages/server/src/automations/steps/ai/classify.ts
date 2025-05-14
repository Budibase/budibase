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
    const categoryDescriptionMap: Record<string, string> = {}

    inputs.categoryItems!.forEach(item => {
      categoryDescriptionMap[item.category] = item.description
    })

    const categoriesWithDescriptions = categories
      .map(cat => `${cat}: ${categoryDescriptionMap[cat] || ""}`)
      .join("\n")

    const request = new ai.LLMRequest().addUserMessage(
      `Return the category of this text: "${inputs.textInput}". 
Based on these categories and their descriptions:
${categoriesWithDescriptions}

Only return the exact category name with no additional text.`
    )

    const llmResponse = await llm.prompt(request)
    const determinedCategory = llmResponse?.message?.trim()

    if (determinedCategory && categories.includes(determinedCategory)) {
      return {
        category: determinedCategory,
        success: true,
      }
    } else if (determinedCategory) {
      return {
        success: false,
        response: `Classify Text AI Step Failed: AI returned category '${determinedCategory}', which is not in the provided list: [${categories.join(
          ", "
        )}].`,
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
