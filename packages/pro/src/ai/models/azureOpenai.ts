import { LLMConfigOptions } from "@budibase/types"
import { OpenAI, GPT_5_MODELS } from "./openai"
import { AzureOpenAI as AzureOpenAIClient } from "openai"
import { createAzure } from "@ai-sdk/azure"

export class AzureOpenAI extends OpenAI {
  override supportsFiles = false

  protected override getAISDKClient(opts: LLMConfigOptions) {
    return createAzure({
      apiKey: opts.apiKey,
      baseURL: opts.baseUrl,
    })
  }

  protected override getOpenAIClientClient(opts: LLMConfigOptions) {
    if (!opts.apiKey) {
      throw new Error("No Azure OpenAI API key found")
    }
    if (!opts.model) {
      throw new Error("No Azure OpenAI model specified")
    }
    return new AzureOpenAIClient({
      apiKey: opts.apiKey,
      apiVersion: "2024-10-01-preview",
      baseURL: opts.baseUrl,
    })
  }

  protected override getVerbosityForModel(): "low" | "medium" | undefined {
    return Object.values(GPT_5_MODELS).includes(this.model as GPT_5_MODELS)
      ? "medium"
      : undefined
  }
}
