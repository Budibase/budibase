import { ai } from "@budibase/pro"
import * as automationUtils from "../../automationUtils"
import {
  GenerateTextStepInputs,
  GenerateTextStepOutputs,
  ContentType,
} from "@budibase/types"
import { utils } from "@budibase/shared-core"

export async function run({
  inputs,
}: {
  inputs: GenerateTextStepInputs
}): Promise<GenerateTextStepOutputs> {
  if (!inputs.contentType || !inputs.instructions) {
    return {
      success: false,
      response:
        "Generate Text AI Step Failed: Content Type and Instructions are required.",
    }
  }

  try {
    const llm = await ai.getLLMOrThrow()

    const contentTypePrompt = getContentTypePrompt(
      inputs.contentType as ContentType
    )

    const request = new ai.LLMRequest().addUserMessage(
      `${contentTypePrompt}

Instructions: ${inputs.instructions}

Generate the content based on these instructions. Format appropriately for a ${inputs.contentType}.`
    )

    const llmResponse = await llm.prompt(request)
    const generatedText = llmResponse?.message?.trim()

    if (generatedText) {
      return {
        response: generatedText,
        success: true,
      }
    }

    return {
      success: false,
      response: "Generate Text AI Step Failed: AI did not return any content.",
    }
  } catch (err: any) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}

function getContentTypePrompt(contentType: ContentType): string | void {
  switch (contentType) {
    case ContentType.EMAIL:
      return "You are writing an email. Include an appropriate, greeting, body, and signature."
    case ContentType.DOCUMENT:
      return "You are writing a formal document. Include appropriate headings, sections, and formatting."
    case ContentType.BLOG_POST:
      return "You are writing a blog post. Include an engaging title, introduction, body with subheadings, and conclusion."
    case ContentType.CHAT_MESSAGE:
      return "You are writing a chat message. Keep it conversational, concise, and appropriate for instant messaging."
    case ContentType.LETTER:
      return "You are writing a letter. Include a date, recipient address, greeting, body, complimentary close, and signature."
    case ContentType.PROPOSAL:
      return "You are writing a proposal. Include an executive summary, problem statement, proposed solution, benefits, and conclusion."
    case ContentType.OTHER:
      return "You are generating text content."
    default:
      return utils.unreachable(contentType)
  }
}
