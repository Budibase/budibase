import AnthropicClient from "@anthropic-ai/sdk"
import { ILargeLanguageModel, LLMPromptResponse } from "@budibase/types"
import * as Prompts from "../prompts"

export type AnthropicModel =
  | "claude-3-5-sonnet-20240620"
  | "claude-3-sonnet-20240229"
  | "claude-3-opus-20240229"
  | "claude-3-haiku-20240307"

export interface AnthropicConfigOptions {
  model: AnthropicModel
  apiKey: string
  measureUsage?: boolean
}

export class Anthropic implements ILargeLanguageModel {
  private client: AnthropicClient
  model: string

  constructor({ model, apiKey }: AnthropicConfigOptions) {
    this.model = model
    this.client = new AnthropicClient({ apiKey })
  }

  async chatCompletion(prompt: string): Promise<LLMPromptResponse> {
    try {
      const completion = await this.client.messages.create({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: parseInt(
          process.env.BUDIBASE_AI_MAX_PROMPT_TOKENS || "300"
        ),
      })

      const content = <AnthropicClient.TextBlock>completion?.content[0]
      return { message: content.text }
    } catch (err) {
      if (err instanceof AnthropicClient.APIError) {
        console.error(
          `Anthropic Prompt failed with error ${err.name} and status: ${err.status}`
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
