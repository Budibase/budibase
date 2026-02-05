import {
  ImageContentTypes,
  LLMConfigOptions,
  LLMStreamChunk,
  ResponseFormat,
} from "@budibase/types"
import { Readable } from "node:stream"
import {
  default as openai,
  default as OpenAIClient,
  OpenAI as OpenAITypes,
  toFile,
} from "openai"
import { LLMFullResponse } from "../../types/ai"
import { LLMRequest } from "../llm"
import { normalizeContentType } from "../utils"
import { LLM } from "./base"

export type OpenAIModel =
  | "gpt-4o-mini"
  | "gpt-4o"
  | "gpt-4"
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "gpt-4-turbo"
  | "gpt-3.5-turbo"
  | "gpt-5"
  | "gpt-5-mini"
  | "gpt-5-nano"

export enum GPT_5_MODELS {
  GPT_5_MINI = "gpt-5-mini",
  GPT_5 = "gpt-5",
  GPT_5_NANO = "gpt-5-nano",
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

function calculateBudibaseAICredits(
  usage?: OpenAIClient.CompletionUsage
): number {
  if (!usage) {
    return 0
  }

  // Output tokens are 3 times more expensive in OpenAI
  // We want to have a single figure in BB for simplicity
  const inputTokens = usage.prompt_tokens
  const outputTokens = usage.completion_tokens
  return outputTokens * 3 + inputTokens
}

export class OpenAI extends LLM {
  protected client: OpenAIClient
  constructor(opts: LLMConfigOptions) {
    super(opts)
    this.client = this.getClient(opts)
  }

  // Default verbosity preference for supported models. Subclasses
  // (e.g. AzureOpenAI) can override to align with provider limits.
  protected getVerbosityForModel(): "low" | "medium" | undefined {
    if (Object.values(GPT_5_MODELS).includes(this.model as GPT_5_MODELS)) {
      return "low"
    }
    return undefined
  }

  protected getClient(opts: LLMConfigOptions): OpenAIClient {
    if (!opts.apiKey) {
      throw new Error("No OpenAI API key found")
    }
    return new OpenAIClient({ apiKey: opts.apiKey })
  }

  async uploadFile(
    data: Readable | Buffer,
    filename: string,
    contentType?: string
  ): Promise<string> {
    const normalizedContentType = normalizeContentType(contentType)

    // If it's an image we need to convert it to a base64 string.
    if (ImageContentTypes.includes(normalizedContentType.toLowerCase())) {
      let buffer: Buffer
      if (Buffer.isBuffer(data)) {
        buffer = data
      } else {
        const chunks: Uint8Array[] = []
        for await (const chunk of data as Readable) {
          chunks.push(new Uint8Array(chunk))
        }
        buffer = Buffer.concat(chunks)
      }
      const base64 = buffer.toString("base64")
      return `data:${normalizedContentType};base64,${base64}`
    }

    // For documents, use the files API
    const file = await toFile(data, filename)
    const res = await this.client.files.create({ file, purpose: "assistants" })
    return res.id
  }

  protected async chatCompletion(
    request: LLMRequest
  ): Promise<LLMFullResponse> {
    const parameters: OpenAITypes.ChatCompletionCreateParamsNonStreaming = {
      model: this.model,
      messages: request.messages,
      max_completion_tokens: this._maxTokens,
      response_format: parseResponseFormat(request.format),
    }

    if (Object.values(GPT_5_MODELS).includes(this.model as GPT_5_MODELS)) {
      const verbosity = this.getVerbosityForModel()
      if (verbosity) {
        parameters.verbosity = verbosity
      }
      parameters.reasoning_effort = "minimal" // This effectively results in 0 reasoning tokens.
    }

    const completion = await this.client.chat.completions.create(parameters)
    const response = completion?.choices?.[0]?.message

    if (response?.content) {
      return {
        messages: [
          ...request.messages,
          { role: response.role, content: response.content },
        ],
        tokensUsed: calculateBudibaseAICredits(completion.usage),
      }
    } else {
      throw new Error("No response found")
    }
  }

  protected async *chatCompletionStream(
    request: LLMRequest
  ): AsyncGenerator<LLMStreamChunk, void, unknown> {
    const parameters: OpenAITypes.ChatCompletionCreateParamsStreaming = {
      model: this.model,
      messages: request.messages,
      max_completion_tokens: this.maxTokens,
      response_format: parseResponseFormat(request.format),
      stream: true,
    }

    try {
      const stream = await this.client.chat.completions.create(parameters)

      let contentBuffer = ""
      let finalUsage: OpenAIClient.CompletionUsage | null = null

      for await (const chunk of stream) {
        const delta = chunk?.choices?.[0]?.delta
        if (!delta) continue

        // Handle content streaming
        if (delta.content) {
          contentBuffer += delta.content
          yield {
            type: "content",
            content: delta.content,
          }
        }

        if (chunk.usage) {
          finalUsage = chunk.usage
        }
      }

      const totalTokens = finalUsage
        ? calculateBudibaseAICredits(finalUsage)
        : 0

      // Final response
      if (contentBuffer) {
        request.addMessage({
          role: "assistant",
          content: contentBuffer,
        })
      }

      yield {
        type: "done",
        messages: request.messages,
        tokensUsed: totalTokens,
      }
    } catch (error: any) {
      yield {
        type: "error",
        content: error.message,
      }
    }
  }

  async chatCompletions(
    request: OpenAITypes.ChatCompletionCreateParamsNonStreaming
  ): Promise<OpenAITypes.ChatCompletion> {
    return await this.client.chat.completions.create(request)
  }

  async chatCompletionsStream(
    request: OpenAITypes.ChatCompletionCreateParamsStreaming
  ): Promise<AsyncIterable<OpenAITypes.ChatCompletionChunk>> {
    return await this.client.chat.completions.create({
      ...request,
      stream: true,
    })
  }
}
