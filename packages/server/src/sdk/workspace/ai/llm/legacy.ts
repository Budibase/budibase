import { createAzure } from "@ai-sdk/azure"
import { createOpenAI } from "@ai-sdk/openai"
import { env, HTTPError } from "@budibase/backend-core"
import { AIProvider, LLMProviderConfig } from "@budibase/types"
import tracer from "dd-trace"
import { LLMResponse } from "."
import { ai, licensing } from "@budibase/pro"
import { createBBAIClient } from "./bbai"

const getLegacyProviderClient = async (
  provider: AIProvider,
  config: LLMProviderConfig
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
    case "BudibaseAI": {
      const licenseKey = await licensing.keys.getLicenseKey()
      if (!licenseKey) {
        throw new HTTPError("No license key found", 422)
      }
      return createOpenAI({
        baseURL: `${env.BUDICLOUD_URL}/api/ai`,
        apiKey: licenseKey,
      })
    }

    case "Anthropic":
      return createOpenAI({
        baseURL: config.baseUrl || "https://api.anthropic.com/v1",
        apiKey: config.apiKey,
      })
    case "AzureOpenAI":
      return createAzure({
        apiKey: config.apiKey,
        baseURL: config.baseUrl,
        apiVersion: "2024-10-01-preview",
        useDeploymentBasedUrls: true,
      })
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

  const model =
    config.provider === "BudibaseAI"
      ? `budibase/legacy/${config.model}`
      : config.model

  if (config.provider === "BudibaseAI" && !env.SELF_HOSTED) {
    return createBBAIClient(model)
  }

  const llm = await getLegacyProviderClient(config.provider, config)

  return {
    chat: llm.chat(model),
    embedding: llm.embedding(model),
  }
}
