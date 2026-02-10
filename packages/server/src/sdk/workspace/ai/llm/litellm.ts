import { createOpenAI } from "@ai-sdk/openai"
import tracer from "dd-trace"

type LiteLLMFetch = (
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1]
) => ReturnType<typeof fetch>

type LiteLLMOpenAIConfig = {
  apiKey: string
  baseUrl: string
  sessionId?: string
}

export const createLiteLLMOpenAI = (config: LiteLLMOpenAIConfig) => {
  const { apiKey, baseUrl, sessionId } = config

  const clientConfig: {
    apiKey: string
    baseURL: string
    name: string
    fetch: LiteLLMFetch
  } = {
    apiKey,
    baseURL: baseUrl,
    name: "litellm",
    fetch: createLiteLLMFetch(sessionId),
  }

  return {
    llm: createOpenAI(clientConfig),
    providerOptions: getLiteLLMProviderOptions,
  }
}

function createLiteLLMFetch(sessionId?: string): typeof fetch {
  const liteFetch = (async (
    input: Parameters<typeof fetch>[0],
    init?: Parameters<typeof fetch>[1]
  ) => {
    const span = tracer.scope().active()
    let modifiedInit = init

    if (typeof init?.body === "string") {
      try {
        const body = JSON.parse(init.body)
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

        modifiedInit = { ...init, body: JSON.stringify(body) }
      } catch {
        // Not JSON, pass through
      }
    }

    const response = await fetch(input, modifiedInit)

    const litellmCallId = response.headers.get("x-litellm-call-id")
    if (litellmCallId && span) {
      span.setTag("litellm.call_id", litellmCallId)
    }

    return response
  }) as typeof fetch

  // Preserve the preconnect helper required by the OpenAI client typings.
  if (typeof (fetch as any).preconnect === "function") {
    ;(liteFetch as any).preconnect = (fetch as any).preconnect.bind(fetch)
  }

  return liteFetch
}

const getLiteLLMProviderOptions = (hasTools: boolean) => {
  if (!hasTools) return
  return {
    openai: {
      parallelToolCalls: true,
    },
  }
}
