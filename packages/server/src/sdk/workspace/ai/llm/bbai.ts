import { createOpenAI } from "@ai-sdk/openai"
import type { LanguageModelV3StreamResult } from "@ai-sdk/provider"
import type {
  LanguageModelV3StreamPart,
  LanguageModelV3Usage,
} from "@ai-sdk/provider"
import tracer from "dd-trace"
import { quotas } from "@budibase/pro"
import { wrapLanguageModel } from "ai"
import { TransformStream } from "node:stream/web"
import { context } from "@budibase/backend-core"
import { LLMResponse } from "."
import environment from "../../../../environment"

interface OpenAIUsage {
  prompt_tokens?: number
  completion_tokens?: number
  input_tokens?: number
  output_tokens?: number
}

const calculateBudibaseAICredits = (
  inputTokens: number,
  outputTokens: number
): number => outputTokens * 3 + inputTokens

const incrementBudibaseAICreditsFromUsage = async (
  usage?: LanguageModelV3Usage
) => {
  if (!usage) {
    return
  }

  const inputTokens = usage.inputTokens.total ?? 0
  const outputTokens = usage.outputTokens.total ?? 0
  const credits = calculateBudibaseAICredits(inputTokens, outputTokens)
  if (credits > 0) {
    await quotas.incrementBudibaseAICredits(credits)
  }
}

export async function incrementBudibaseAICreditsFromOpenAIUsage(
  usage?: OpenAIUsage
) {
  if (!usage) {
    return
  }

  const inputTokens = usage.prompt_tokens ?? usage.input_tokens ?? 0
  const outputTokens = usage.completion_tokens ?? usage.output_tokens ?? 0
  const credits = calculateBudibaseAICredits(inputTokens, outputTokens)

  if (credits > 0) {
    await quotas.incrementBudibaseAICredits(credits)
  }
}

type BBAIFetch = (
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1]
) => ReturnType<typeof fetch>

const createBBAIFetch = (sessionId?: string): BBAIFetch => {
  const bbaiFetch = (async (
    input: Parameters<typeof fetch>[0],
    init?: Parameters<typeof fetch>[1]
  ) => {
    let modifiedInit = init

    if (typeof init?.body === "string") {
      try {
        const body = JSON.parse(init.body)
        const span = tracer.scope().active()
        if (span) {
          body.metadata = {
            ...body.metadata,
            dd_trace_id: span.context().toTraceId(),
            dd_span_id: span.context().toSpanId(),
          }
        }

        if (sessionId) {
          body.litellm_session_id = sessionId
          body.metadata = {
            ...body.metadata,
            session_id: sessionId,
          }
        }

        body.metadata = {
          ...body.metadata,
          tags: [
            `bbai-cloud`,
            `tenant:${context.getTenantId()}`,
            `workspace:${context.getWorkspaceId()}`,
          ],
        }

        modifiedInit = { ...init, body: JSON.stringify(body) }
      } catch {
        // Not JSON, pass through
      }
    }

    return fetch(input, modifiedInit)
  }) as BBAIFetch

  // Preserve the preconnect helper required by the OpenAI client typings.
  if (typeof (fetch as any).preconnect === "function") {
    ;(bbaiFetch as any).preconnect = (fetch as any).preconnect.bind(fetch)
  }

  return bbaiFetch
}

export async function createBBAIClient(
  model: string,
  sessionId?: string,
  span?: tracer.Span
): Promise<LLMResponse> {
  const baseUrl = environment.LITELLM_URL

  if (span) {
    tracer.llmobs.annotate(span, {
      metadata: {
        modelId: model,
        modelName: model,
        baseUrl,
      },
    })
  }

  const client = createOpenAI({
    apiKey: environment.BBAI_LITELLM_KEY,
    baseURL: baseUrl,
    fetch: createBBAIFetch(sessionId),
  })
  const chat = wrapLanguageModel({
    model: client.chat(model),
    middleware: {
      specificationVersion: "v3",
      async wrapGenerate({ doGenerate }) {
        const result = await doGenerate()
        await incrementBudibaseAICreditsFromUsage(result.usage).catch(() => {})
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
              await incrementBudibaseAICreditsFromUsage(chunk.usage).catch(
                () => {}
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
