import { LLMConfigOptions } from "@budibase/types"
import { OpenAI } from "./openai"
import { default as OpenAIClient } from "openai"
import { createOpenAI } from "@ai-sdk/openai"

type LiteLLMFetch = (
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1]
) => ReturnType<typeof fetch>

type LiteLLMOpenAIConfig = {
  apiKey: string
  baseUrl: string
  fetch?: LiteLLMFetch
}

export class LiteLLMAI extends OpenAI {
  protected override getClient(opts: LLMConfigOptions) {
    if (!opts.apiKey) {
      throw new Error("No LiteLLM API key found")
    }
    return new OpenAIClient({ apiKey: opts.apiKey, baseURL: opts.baseUrl })
  }
}

export const getLiteLLMProvider = (modelId: string) => {
  const [provider] = modelId.split("/")
  return provider || "openai"
}

export const getLiteLLMProviderOptions = () => {
  return {
    openai: {
      parallelToolCalls: true,
    },
  }
}

export const createLiteLLMOpenAI = (config: LiteLLMOpenAIConfig) => {
  const { apiKey, baseUrl, fetch } = config

  const clientConfig: {
    apiKey: string
    baseURL: string
    name: string
    fetch?: LiteLLMFetch
  } = {
    apiKey,
    baseURL: baseUrl,
    name: "litellm",
  }

  if (fetch) {
    clientConfig.fetch = fetch
  }

  return createOpenAI(clientConfig)
}
