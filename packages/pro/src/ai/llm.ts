import { ChatCompletionRequest, Message, ResponseFormat } from "@budibase/types"
import openai from "openai"
import { z } from "zod"

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
