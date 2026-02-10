import { createOpenAI } from "@ai-sdk/openai"
import { HTTPError } from "@budibase/backend-core"
import tracer from "dd-trace"
import sdk from "../../.."
import environment from "../../../../environment"
import { getKeySettings } from "../configs/litellm"

type LiteLLMFetch = (
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1]
) => ReturnType<typeof fetch>

export const createLiteLLMOpenAI = async (
  configId: string,
  sessionId?: string,
  span?: tracer.Span
) => {
  const config = await getLiteLLMModelConfigOrThrow(configId)

  const { apiKey, baseUrl, modelId, modelName } = config

  if (span) {
    tracer.llmobs.annotate(span, {
      metadata: {
        modelId,
        modelName,
        baseUrl,
      },
    })
  }

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

  const llm = createOpenAI(clientConfig)
  return {
    chat: llm.chat(modelId),
    embedding: llm.embedding(modelId),
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

async function getLiteLLMModelConfigOrThrow(configId: string): Promise<{
  modelName: string
  modelId: string
  apiKey: string
  baseUrl: string
}> {
  const aiConfig = await sdk.ai.configs.find(configId)

  if (!aiConfig) {
    throw new HTTPError("Config not found", 400)
  }

  const { secretKey } = await getKeySettings()
  if (!secretKey) {
    throw new HTTPError(
      "LiteLLM should be configured. Contact support if the issue persists.",
      500
    )
  }

  return {
    modelName: aiConfig.model,
    modelId: aiConfig.liteLLMModelId,
    apiKey: secretKey,
    baseUrl: environment.LITELLM_URL,
  }
}
