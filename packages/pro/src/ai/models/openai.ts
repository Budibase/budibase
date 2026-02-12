import {
  ImageContentTypes,
  LLMConfigOptions,
  ResponseFormat,
} from "@budibase/types"
import { Readable } from "node:stream"
import { toFile, OpenAI as OpenAIClient } from "openai"
import { LLMFullResponse } from "../../types/ai"
import { LLMRequest } from "../llm"
import { normalizeContentType } from "../utils"
import { LLM } from "./base"
import { generateText, LanguageModelUsage, Output } from "ai"
import {
  createOpenAI,
  OpenAIProvider,
  type OpenAIChatLanguageModelOptions,
} from "@ai-sdk/openai"
import { SharedV3ProviderOptions } from "@ai-sdk/provider"

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
  | ReturnType<typeof Output.text>
  | ReturnType<typeof Output.json>
  | ReturnType<typeof Output.object>
  | undefined {
  if (!responseFormat) {
    return
  }

  if (responseFormat === "text") {
    return Output.text()
  }
  if (responseFormat === "json") {
    return Output.json()
  }

  return Output.object({ schema: responseFormat })
}

function calculateBudibaseAICredits(usage?: LanguageModelUsage): number {
  if (!usage) {
    return 0
  }

  // Output tokens are 3 times more expensive in OpenAI
  // We want to have a single figure in BB for simplicity
  const inputTokens = usage.inputTokens ?? 0
  const outputTokens = usage.outputTokens ?? 0
  return outputTokens * 3 + inputTokens
}

export class OpenAI extends LLM {
  protected client: OpenAIProvider
  protected openAIClient: OpenAIClient
  constructor(opts: LLMConfigOptions) {
    super(opts)
    if (!opts.apiKey) {
      throw new Error("No OpenAI API key found")
    }

    let baseUrl = opts.baseUrl
    if (baseUrl === "https://api.openai.com") {
      baseUrl = "https://api.openai.com/v1"
    }
    this.client = createOpenAI({ apiKey: opts.apiKey, baseURL: baseUrl })
    this.openAIClient = new OpenAIClient({
      apiKey: opts.apiKey,
      baseURL: baseUrl,
    })
  }

  // Default verbosity preference for supported models. Subclasses
  // (e.g. AzureOpenAI) can override to align with provider limits.
  protected getVerbosityForModel(): "low" | "medium" | undefined {
    if (Object.values(GPT_5_MODELS).includes(this.model as GPT_5_MODELS)) {
      return "low"
    }
    return undefined
  }

  protected getProviderOptions(): SharedV3ProviderOptions | undefined {
    if (!Object.values(GPT_5_MODELS).includes(this.model as GPT_5_MODELS)) {
      return
    }

    const openAIConfig: OpenAIChatLanguageModelOptions = {}
    const verbosity = this.getVerbosityForModel()
    if (verbosity) {
      openAIConfig.textVerbosity = verbosity
    }
    openAIConfig.reasoningEffort = "minimal" // This effectively results in 0 reasoning tokens.

    return { openai: openAIConfig }
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

    const res = await this.openAIClient.files.create({
      file,
      purpose: "assistants",
    })
    return res.id
  }

  protected async chatCompletion(
    request: LLMRequest
  ): Promise<LLMFullResponse> {
    const providerOptions = this.getProviderOptions()

    const response = await generateText({
      model: this.client.chat(this.model),
      messages: request.messages,
      maxOutputTokens: this._maxTokens,
      output: parseResponseFormat(request.format),
      providerOptions: providerOptions,
    })

    if (response.response.messages.length) {
      return {
        messages: [...request.messages, ...response.response.messages],
        tokensUsed: calculateBudibaseAICredits(response.totalUsage),
      }
    }

    throw new Error("No response found")
  }
}
