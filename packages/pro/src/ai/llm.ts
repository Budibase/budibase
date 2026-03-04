import {
  AIProvider,
  ChatCompletionRequest,
  Message,
  ResponseFormat,
} from "@budibase/types"
import openai from "openai"
import { z } from "zod"

// Provider-specific default models. If a provider's saved config does not
// include a default model, we fall back to these. Azure defaults to gpt-4.1
// so we avoid GPT-5-only parameters like verbosity/reasoning_effort.
export const DefaultModelByProvider: Record<AIProvider, string> = {
  OpenAI: "gpt-5-mini",
  TogetherAI: "gpt-5-mini",
  AzureOpenAI: "gpt-4.1",
  Custom: "gpt-5-mini",
  Anthropic: "claude-3-5-sonnet-20240620",
  BudibaseAI: "gpt-5-mini",
}

export function parseResponseFormat(
  responseFormat?: ResponseFormat
):
  | openai.ResponseFormatText
  | openai.ResponseFormatJSONObject
  | openai.ResponseFormatJSONSchema
  | undefined {
  if (!responseFormat) {
    return
  }

  if (responseFormat === "text") {
    return { type: "text" }
  }
  if (responseFormat === "json") {
    return { type: "json_object" }
  }

  return responseFormat
}

export class LLMRequest {
  messages: Message[] = []
  format?: ResponseFormat

  withFormat(
    format: "text" | "json" | openai.ResponseFormatJSONSchema | z.ZodType
  ) {
    if (format instanceof z.ZodType) {
      this.format = {
        type: "json_schema",
        json_schema: {
          name: "response",
          strict: false,
          schema: format.toJSONSchema({ target: "draft-7" }),
        },
      }
    } else {
      this.format = format
    }
    return this
  }

  addMessage(message: Message) {
    this.messages.push(message)
    return this
  }

  addMessages(messages: Message[]) {
    this.messages.push(...messages)
    return this
  }

  addUserMessage(content: string) {
    this.messages.push({ role: "user", content })
    return this
  }

  addSystemMessage(content: string) {
    this.messages.push({ role: "system", content })
    return this
  }

  static fromRequest(req: ChatCompletionRequest) {
    const prompt = new LLMRequest()
    if (req.messages) {
      prompt.addMessages(req.messages)
    }
    if (req.format) {
      prompt.withFormat(req.format)
    }
    return prompt
  }
}
