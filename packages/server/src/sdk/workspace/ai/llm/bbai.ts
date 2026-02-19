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

function createBBAIFetch(sessionId?: string): typeof fetch {
  const bbaiFetch = (async (
    input: Parameters<typeof fetch>[0],
    init?: Parameters<typeof fetch>[1]
  ) => {
    let modifiedInit = init

    if (sessionId && typeof init?.body === "string") {
      try {
        const body = JSON.parse(init.body)
        body.metadata = {
          ...body.metadata,
          session_id: sessionId,
        }
        modifiedInit = { ...init, body: JSON.stringify(body) }
      } catch {
        // Not JSON, pass through
      }
    }

    return fetch(input, modifiedInit)
  }) as typeof fetch

  if (typeof (fetch as any).preconnect === "function") {
    ;(bbaiFetch as any).preconnect = (fetch as any).preconnect.bind(fetch)
  }

  return bbaiFetch
}

export async function createBBAIClient(
  model: string,
  sessionId?: string
): Promise<LLMResponse> {
  const providerRequest = resolveBudibaseAIProviderRequest(model)

  const client = createOpenAI({
    apiKey: providerRequest.apiKey,
    baseURL: providerRequest.baseUrl,
    fetch: createBBAIFetch(sessionId),
  })
  const chat = wrapLanguageModel({
    model: client.chat(providerRequest.model),
    middleware: {
      specificationVersion: "v3",
      async wrapGenerate({ doGenerate }) {
        const result = await doGenerate()
        await incrementBudibaseAICreditsFromTokenUsage(
          toBudibaseUsage(result.usage)
        )
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
              )
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
