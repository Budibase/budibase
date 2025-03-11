import OpenAIClient from "openai"
import { ILargeLanguageModel, LLMPromptResponse } from "@budibase/types"
import * as Prompts from "../prompts"

export type OpenAIModel =
  | "gpt-4o-mini"
  | "gpt-4o"
  | "gpt-4"
  | "gpt-4-turbo"
  | "gpt-3.5-turbo"

export interface OpenAIConfigOptions {
  model: OpenAIModel
  apiKey: string
  measureUsage: boolean
}

export class OpenAI implements ILargeLanguageModel {
  private client: OpenAIClient
  model: string
  measureUsage: boolean

  constructor({ model, apiKey, measureUsage }: OpenAIConfigOptions) {
    this.model = model
    this.client = new OpenAIClient({
      apiKey,
    })
    this.measureUsage = measureUsage
  }

  measureTokenUsage(usage?: OpenAIClient.CompletionUsage): number {
    let tokensUsed = 0
    if (this.measureUsage && usage) {
      const { prompt_tokens: inputTokens, completion_tokens: outputTokens } =
        usage

      // Output tokens are 3 times more expensive in OpenAI
      // We want to have a single figure in BB for simplicity
      tokensUsed = outputTokens * 3 + inputTokens
    }
    return tokensUsed
  }

  async chatCompletion(prompt: string): Promise<LLMPromptResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: parseInt(
          process.env.BUDIBASE_AI_MAX_PROMPT_TOKENS || "300"
        ),
      })

      const tokensUsed = this.measureTokenUsage(completion.usage)

      const message = completion.choices[0]?.message.content || ""
      return { message, tokensUsed }
    } catch (err) {
      if (err instanceof OpenAIClient.APIError) {
        console.error(
          `OpenAI Prompt failed with error of type ${err.type} and status: ${err.status}:${err.code} - ${err.message}`
        )
      }
      throw err
    }
  }

  async prompt(prompt: string): Promise<LLMPromptResponse> {
    return this.chatCompletion(prompt)
  }

  async summarizeText(prompt: string): Promise<LLMPromptResponse> {
    return this.chatCompletion(Prompts.summarizeText(prompt))
  }
}
