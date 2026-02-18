import { createOpenAI } from "@ai-sdk/openai"
import type { LanguageModelV3StreamResult } from "@ai-sdk/provider"
import type {
  LanguageModelV3StreamPart,
  LanguageModelV3Usage,
} from "@ai-sdk/provider"
import { wrapLanguageModel } from "ai"
import { TransformStream } from "node:stream/web"
import { LLMResponse } from "."
import {
  incrementBudibaseAICreditsFromTokenUsage,
  resolveBudibaseAIProviderRequest,
} from "./bbaiShared"

const toBudibaseUsage = (
  usage?: LanguageModelV3Usage
): { inputTokens: number; outputTokens: number } | undefined => {
  if (!usage) {
    return
  }

  return {
    inputTokens: usage.inputTokens.total ?? 0,
    outputTokens: usage.outputTokens.total ?? 0,
  }
}

export async function createBBAIClient(model: string): Promise<LLMResponse> {
  const providerRequest = resolveBudibaseAIProviderRequest(model)

  const client = createOpenAI({
    apiKey: providerRequest.apiKey,
    baseURL: providerRequest.baseUrl,
  })
  const chat = wrapLanguageModel({
    model: client.chat(providerRequest.model),
    middleware: {
      specificationVersion: "v3",
      async wrapGenerate({ doGenerate }) {
        const result = await doGenerate()
        await incrementBudibaseAICreditsFromTokenUsage(
          toBudibaseUsage(result.usage)
        ).catch(() => {})
        return result
      },
      async wrapStream({ doStream }) {
        const result = await doStream()
        const transformStream = new TransformStream<
          LanguageModelV3StreamPart,
          LanguageModelV3StreamPart
        >({
          async transform(chunk, controller) {
            controller.enqueue(chunk)
            if (chunk.type === "finish") {
              await incrementBudibaseAICreditsFromTokenUsage(
                toBudibaseUsage(chunk.usage)
              ).catch(() => {})
            }
            return
          },
        }) as Parameters<typeof result.stream.pipeThrough>[0]

        return {
          ...result,
          stream: result.stream.pipeThrough(
            transformStream
          ) as LanguageModelV3StreamResult["stream"],
        }
      },
    },
  })
  return {
    chat,
    embedding: (() => {
      throw new Error("BBAI embeddings are not supported")
    }) as any,
    providerOptions: undefined,
  }
}
