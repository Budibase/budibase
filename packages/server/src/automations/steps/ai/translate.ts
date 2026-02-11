import { generateText } from "ai"
import { TranslateStepInputs, TranslateStepOutputs } from "@budibase/types"
import * as automationUtils from "../../automationUtils"
import { ai } from "@budibase/pro"
import sdk from "../../../sdk"

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
