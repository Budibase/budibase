import { createAzure } from "@ai-sdk/azure"
import { createOpenAI } from "@ai-sdk/openai"
import { AIProvider } from "@budibase/types"
import tracer from "dd-trace"
import { LLMResponse } from "."
import { ai } from "@budibase/pro"
import { createBBAIClient } from "./bbai"

const getLegacyProviderClient = (
  provider: AIProvider,
  config: Awaited<ReturnType<typeof ai.getLLMConfig>>
) => {
  if (!config) {
    throw new Error("No LLM config found")
  }

  switch (provider) {
    case "OpenAI":
    case "TogetherAI":
    case "Custom":
      return createOpenAI({
        baseURL: config.baseUrl,
        apiKey: config.apiKey,
      })
    case "AzureOpenAI":
      return createAzure({
        apiKey: config.apiKey,
        baseURL: config.baseUrl,
        apiVersion: "2024-10-01-preview",
        useDeploymentBasedUrls: true,
      })
    case "Anthropic":
      throw new Error(
        "Legacy Anthropic is not supported in this path. Use AI Configs instead."
      )
    default:
      throw new Error(`Unsupported legacy provider: ${provider}`)
  }
}

export const createLegacyLLM = async (
  span?: tracer.Span
): Promise<LLMResponse | undefined> => {
  const config = await ai.getLLMConfig()
  if (!config) {
    return undefined
  }

  if (span) {
    tracer.llmobs.annotate(span, {
      metadata: {
        provider: config.provider,
        modelName: config.model,
        baseUrl: config.baseUrl,
      },
    })
  }

  if (config.provider === "BudibaseAI") {
    return createBBAIClient(`legacy/${config.model}`)
  }

  const llm = getLegacyProviderClient(config.provider, config)

  return {
    chat: llm.chat(config.model),
    embedding: llm.embedding(config.model),
  }
}
