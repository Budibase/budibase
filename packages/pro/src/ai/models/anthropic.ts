import AnthropicClient from "@anthropic-ai/sdk"
import { LLMConfigOptions, LLMStreamChunk } from "@budibase/types"
import { LLMFullResponse } from "../../types/ai"
import { LLMRequest } from "../llm"
import { LLM } from "./base"

export type AnthropicModel =
  | "claude-3-5-sonnet-20240620"
  | "claude-3-sonnet-20240229"
  | "claude-3-opus-20240229"
  | "claude-3-haiku-20240307"

function calculateBudibaseAICredits(usage?: AnthropicClient.Usage): number {
  if (!usage) {
    return 0
  }

  // Output tokens are 3 times more expensive in OpenAI
  // We want to have a single figure in BB for simplicity
  const inputTokens = usage.input_tokens
  const outputTokens = usage.output_tokens
  return outputTokens * 3 + inputTokens
}

export class Anthropic extends LLM {
  private client: AnthropicClient

  constructor(opts: LLMConfigOptions) {
    super(opts)
    this.client = new AnthropicClient({ apiKey: opts.apiKey })
  }

  firstTextBlock(message: AnthropicClient.Messages.Message) {
    for (const content of message.content) {
      if (content.type !== "text") {
        continue
      }
      return content.text
    }
    return undefined
  }
  async uploadFile(
    _data?: any,
    _filename?: string,
    _contentType?: string
  ): Promise<string> {
    throw new Error("File upload not supported for this LLM provider")
  }

  protected async chatCompletion(
    request: LLMRequest
  ): Promise<LLMFullResponse> {
    try {
      const completion = await this.client.messages.create({
        model: this.model,
        messages: request.messages.map(({ content }) => {
          if (content == null) {
            return { role: "user", content: "" }
          }
          if (typeof content === "string") {
            return {
              // Anthropic's API doesn't seem to have any notion of system messages,
              // just "user" and "assistant" where "assistant" represents the AI.
              role: "user",
              content,
            }
          }

          let message = ""
          for (const part of content) {
            if (part.type === "text") {
              message += part.text
            } else if (
              ["image_url", "input_audio", "file"].includes(part.type)
            ) {
              // TODO: maybe support this one day
            }
          }

          return {
            role: "user",
            content: message,
          }
        }),
        max_tokens: this.maxTokens,
      })

      const message = this.firstTextBlock(completion) || ""
      return {
        messages: [
          ...request.messages,
          { role: "assistant", content: message },
        ],
        tokensUsed: calculateBudibaseAICredits(completion.usage),
      }
    } catch (err) {
      if (err instanceof AnthropicClient.APIError) {
        console.error(
          `Anthropic Prompt failed with error ${err.name} and status: ${err.status}`
        )
      }
      throw err
    }
  }

  protected async *chatCompletionStream(
    request: LLMRequest
  ): AsyncGenerator<LLMStreamChunk, void, unknown> {
    // TODO: Implement streaming for Anthropic
    // For now, fall back to non-streaming and yield all at once
    try {
      const response = await this.chatCompletion(request)

      // Yield the final message content if available
      if (response.messages.length > 0) {
        const lastMessage = response.messages[response.messages.length - 1]
        if (lastMessage.content) {
          yield {
            type: "content",
            content: lastMessage.content as string,
          }
        }
      }

      yield {
        type: "done",
        messages: response.messages,
        tokensUsed: response.tokensUsed,
      }
    } catch (error: any) {
      yield {
        type: "error",
        content: error.message,
      }
    }
  }
}
