import { createOpenAI } from "@ai-sdk/openai"
import type { LanguageModelV3StreamResult } from "@ai-sdk/provider"
import type {
  LanguageModelV3StreamPart,
  LanguageModelV3Usage,
} from "@ai-sdk/provider"
import { constants, context, env, HTTPError } from "@budibase/backend-core"
import {
  ImageContentTypes,
  LLMResponse,
  ReasoningEffort,
} from "@budibase/types"
import tracer from "dd-trace"
import { licensing, quotas } from "@budibase/pro"
import { wrapLanguageModel } from "ai"
import { TransformStream } from "node:stream/web"
import environment from "../../../../environment"
import { Readable } from "stream"
import { blob } from "stream/consumers"
import { unwrapLiteLLMFileId } from "./litellm"

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

const createBBAIFetch = (
  sessionId?: string,
  reasoningEffort?: ReasoningEffort,
  agentId?: string
): BBAIFetch => {
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

        if (agentId) {
          body.metadata = {
            ...body.metadata,
            agent_id: agentId,
          }
          if (!body.user) {
            body.user = `bb-agent:${agentId}`
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
        if (reasoningEffort) {
          body.reasoning_effort = reasoningEffort
          body.extra_body = {
            ...(body.extra_body || {}),
            include_reasoning: true,
          }
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
  span?: tracer.Span,
  reasoningEffort?: ReasoningEffort,
  agentId?: string
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
    fetch: createBBAIFetch(sessionId, reasoningEffort, agentId),
  })
  const chat = wrapLanguageModel({
    model: client.chat(model),
    middleware: {
      specificationVersion: "v3",
      async wrapGenerate({ doGenerate }) {
        await quotas.throwIfBudibaseAICreditsExceeded()
        const result = await doGenerate()
        await incrementBudibaseAICreditsFromUsage(result.usage).catch(() => {})
        return result
      },
      async wrapStream({ doStream }) {
        await quotas.throwIfBudibaseAICreditsExceeded()
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
    uploadFile: async (
      stream: Readable,
      filename: string,
      contentType?: string
    ) => {
      const type = (contentType || "application/pdf").toLowerCase()
      const fileBlob = (await blob(stream)) as Blob
      const isImage = ImageContentTypes.includes(type)

      if (!env.SELF_HOSTED) {
        if (isImage) {
          const fileBuffer = Buffer.from(await fileBlob.arrayBuffer())
          return `data:${type};base64,${fileBuffer.toString("base64")}`
        }
        const formdata = new FormData()
        formdata.append("purpose", "assistants")
        formdata.append("file", fileBlob, filename)
        formdata.append("model", model)

        const liteLLMBaseUrl = environment.LITELLM_URL.replace(/\/v1\/?$/, "")
        const response = await fetch(`${liteLLMBaseUrl}/v1/files`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${environment.BBAI_LITELLM_KEY}`,
          },
          body: formdata,
        })

        if (!response.ok) {
          throw await HTTPError.fromResponse(response)
        }

        const result = await response.json()
        if (typeof result.id !== "string") {
          throw new Error("File id not found")
        }
        return unwrapLiteLLMFileId(result.id)
      } else {
        const fileBuffer = Buffer.from(await fileBlob.arrayBuffer())
        const base64 = fileBuffer.toString("base64")

        if (isImage) {
          return `data:${type};base64,${base64}`
        }
        if (!env.BUDICLOUD_URL) {
          throw new Error("No Budibase URL found")
        }
        const licenseKey = await licensing.keys.getLicenseKey()
        if (!licenseKey) {
          throw new Error("No license key found")
        }

        const response = await fetch(
          `${env.BUDICLOUD_URL}/api/ai/upload-file`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              [constants.Header.LICENSE_KEY]: licenseKey,
            },
            body: JSON.stringify({
              data: base64,
              filename,
              contentType: type,
            }),
          }
        )

        if (!response.ok) {
          throw await HTTPError.fromResponse(response)
        }

        const result = await response.json()
        return result.file
      }
    },
  }
}
