import { ai } from "@budibase/pro"
import * as automationUtils from "../../automationUtils"
import {
  ExtractTextDataStepInputs,
  ExtractTextDataStepOutputs,
} from "@budibase/types"

async function parseAIResponse(llmResponse: any): Promise<Record<string, any>> {
  try {
    const data = JSON.parse(llmResponse.message)
    return data.data
  } catch (err: any) {
    console.error("Error parsing JSON response:", err)
    throw new Error("Could not parse AI response as valid JSON.")
  }
}

export async function run({
  inputs,
}: {
  inputs: ExtractTextDataStepInputs
}): Promise<ExtractTextDataStepOutputs> {
  if (!inputs.text || !inputs.schema) {
    return {
      success: false,
      data: {},
      response:
        "Extract Text Data AI Step Failed: Text and Schema are required.",
    }
  }

  try {
    const llm = await ai.getLLMOrThrow()

    const request = ai.extractTextData(inputs.schema, inputs.text)
    const llmResponse = await llm.prompt(request)

    const data = await parseAIResponse(llmResponse)

    return {
      data,
      success: true,
    }
  } catch (err: any) {
    console.error("Text extraction error:", err)
    return {
      success: false,
      data: {},
      response: automationUtils.getError(err),
    }
  }
}
