import { LLMConfigOptions } from "@budibase/types"
import tracer from "dd-trace"
import { LLMFullResponse, LLMPromptResponse } from "../../types/ai"
import { LLMRequest } from "../llm"
import { summarizeText } from "../prompts"

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

  abstract supportsFiles: boolean

  protected abstract chatCompletion(
    request: LLMRequest
  ): Promise<LLMFullResponse>

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

  async chat(request: LLMRequest): Promise<LLMFullResponse> {
    return await tracer.trace("chat", async () => {
      const response = await this.chatCompletion(request)
      return response
    })
  }

  async summarizeText(prompt: string): Promise<LLMPromptResponse> {
    return tracer.trace("summarizeText", () =>
      this.prompt(summarizeText(prompt))
    )
  }
}
