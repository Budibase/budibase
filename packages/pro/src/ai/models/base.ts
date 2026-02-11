import { utils } from "@budibase/shared-core"
import {
  AIFieldMetadata,
  AIOperationEnum,
  EnrichedBinding,
  LLMConfigOptions,
  LLMStreamChunk,
  Row,
  Snippet,
} from "@budibase/types"
import tracer from "dd-trace"
import { Readable } from "node:stream"
import { LLMFullResponse, LLMPromptResponse } from "../../types/ai"
import { LLMRequest } from "../llm"
import {
  classifyText,
  cleanData,
  generateCronExpression,
  generateJsPrompt,
  searchWeb,
  sentimentAnalysis,
  summarizeText,
  translate,
} from "../prompts"

function extractTextFromColumns(row: Row, columns: string[]) {
  return columns.map(column => row[column]).join(" ")
}

export abstract class LLM {
  protected _model: string
  protected _apiKey?: string
  protected _maxTokens: number

  constructor({ model, apiKey, maxTokens }: LLMConfigOptions) {
    this._model = model
    this._apiKey = apiKey
    this._maxTokens =
      maxTokens ?? parseInt(process.env.BUDIBASE_AI_MAX_PROMPT_TOKENS || "1000")
  }

  get model() {
    return this._model
  }
  get apiKey() {
    return this._apiKey
  }
  get maxTokens() {
    return this._maxTokens
  }

  protected abstract chatCompletion(
    request: LLMRequest
  ): Promise<LLMFullResponse>

  protected abstract chatCompletionStream(
    request: LLMRequest
  ): AsyncGenerator<LLMStreamChunk, void, unknown>

  async prompt(
    requestOrString: string | LLMRequest
  ): Promise<LLMPromptResponse> {
    return await tracer.trace("prompt", async () => {
      const request =
        typeof requestOrString === "string"
          ? new LLMRequest().addUserMessage(requestOrString)
          : requestOrString
      const { messages, tokensUsed } = await tracer.trace(
        "chatCompletion",
        () => this.chatCompletion(request)
      )
      if (!messages || messages.length === 0) {
        return { message: "", tokensUsed }
      }
      const lastMessage = messages[messages.length - 1]
      return { message: (lastMessage.content as string) || "", tokensUsed }
    })
  }

  abstract uploadFile(
    data: Readable | Buffer,
    filename: string,
    contentType?: string
  ): Promise<string>

  async chat(request: LLMRequest): Promise<LLMFullResponse> {
    return await tracer.trace("chat", async () => {
      const response = await this.chatCompletion(request)
      return response
    })
  }

  async *chatStream(
    request: LLMRequest
  ): AsyncGenerator<LLMStreamChunk, void, unknown> {
    yield* this.chatCompletionStream(request)
  }

  async summarizeText(prompt: string): Promise<LLMPromptResponse> {
    return tracer.trace("summarizeText", () =>
      this.prompt(summarizeText(prompt))
    )
  }

  async generateCronExpression(prompt: string): Promise<LLMPromptResponse> {
    return tracer.trace("generateCronExpression", () =>
      this.prompt(generateCronExpression(prompt))
    )
  }

  async operation(
    schema: AIFieldMetadata,
    row: Row
  ): Promise<LLMPromptResponse> {
    return tracer.trace("operation", span => {
      span.addTags({
        operation: schema.operation,
        rowId: row.id,
      })
      const prompt = this.promptForOperation(schema, row)
      return this.prompt(prompt)
    })
  }

  private promptForOperation(schema: AIFieldMetadata, row: Row) {
    const { operation, column, columns, language, categories, prompt } = schema
    switch (operation) {
      case AIOperationEnum.SUMMARISE_TEXT:
        return summarizeText(extractTextFromColumns(row, columns!))

      case AIOperationEnum.CLEAN_DATA:
        return cleanData(row[column!])

      case AIOperationEnum.TRANSLATE:
        return translate(row[column!], language!)

      case AIOperationEnum.CATEGORISE_TEXT:
        if (!categories) {
          throw Error(
            "No categories provided for categorise text operation. Please provide categories."
          )
        }
        return classifyText(
          extractTextFromColumns(row, columns!),
          categories.split(",")
        )

      case AIOperationEnum.SENTIMENT_ANALYSIS:
        return sentimentAnalysis(row[column!])

      case AIOperationEnum.PROMPT:
        return prompt!

      case AIOperationEnum.SEARCH_WEB:
        return searchWeb(extractTextFromColumns(row, columns!))

      default:
        throw utils.unreachable(operation)
    }
  }

  async generateJs(
    prompt: string,
    opts?: { bindings: EnrichedBinding[]; snippets: Snippet[] }
  ): Promise<LLMPromptResponse> {
    return await tracer.trace("generateJs", async () => {
      const { bindings = [], snippets = [] } = opts || {}
      return await this.prompt(
        generateJsPrompt(bindings, snippets).addUserMessage(prompt)
      )
    })
  }
}
