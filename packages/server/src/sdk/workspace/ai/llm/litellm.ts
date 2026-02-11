import { createOpenAI } from "@ai-sdk/openai"
import { constants, env, HTTPError } from "@budibase/backend-core"
import { licensing, quotas } from "@budibase/pro"
import tracer from "dd-trace"
import environment from "../../../../environment"
import { getKeySettings } from "../configs/litellm"
import {
  AIQuotaUsageResponse,
  BUDIBASE_AI_PROVIDER_ID,
  CustomAIProviderConfig,
} from "@budibase/types"
import { LLMResponse } from "."

type LiteLLMFetch = (
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1]
) => ReturnType<typeof fetch>

export const createLiteLLMOpenAI = async (
  aiConfig: CustomAIProviderConfig,
  sessionId?: string,
  span?: tracer.Span
): Promise<LLMResponse> => {
  const { apiKey, baseUrl } = await getLiteLLMModelSettings()

  const { liteLLMModelId: modelId, model: modelName } = aiConfig

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
    fetch: createLiteLLMFetch(sessionId, aiConfig),
  }

  const llm = createOpenAI(clientConfig)
  return {
    chat: llm.chat(modelId),
    embedding: llm.embedding(modelId),
    providerOptions: getLiteLLMProviderOptions,
  }
}

function createLiteLLMFetch(
  sessionId?: string,
  aiConfig?: CustomAIProviderConfig
): typeof fetch {
  const shouldSyncCredits =
    !!aiConfig &&
    aiConfig.provider === BUDIBASE_AI_PROVIDER_ID &&
    env.SELF_HOSTED

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

    if (shouldSyncCredits) {
      syncBudibaseAICredits()
    }

    return response
  }) as typeof fetch

  // Preserve the preconnect helper required by the OpenAI client typings.
  if (typeof (fetch as any).preconnect === "function") {
    ;(liteFetch as any).preconnect = (fetch as any).preconnect.bind(fetch)
  }

  return liteFetch
}

const syncBudibaseAICredits = async () => {
  try {
    const aiQuota = await fetchAIQuotaUsage()
    if (aiQuota != null) {
      await quotas.setBudibaseAICredits(aiQuota.monthlyCredits)
    }
  } catch {
    // Best-effort sync only.
    console.error("Error synching budibase AI credits")
  }
}

const fetchAIQuotaUsage = async () => {
  if (!env.BUDICLOUD_URL) {
    return
  }
  const licenseKey = await licensing.keys.getLicenseKey()
  if (!licenseKey) {
    return
  }
  const url = `${env.BUDICLOUD_URL}/api/ai/quotas`
  const response = await fetch(url, {
    headers: {
      [constants.Header.LICENSE_KEY]: licenseKey,
    },
  })
  if (!response.ok) {
    console.error("Error fetching AI quota", {
      statusText: response.statusText,
    })
    return
  }
  return (await response.json()) as AIQuotaUsageResponse
}

const getLiteLLMProviderOptions = (hasTools: boolean) => {
  if (!hasTools) return
  return {
    openai: {
      parallelToolCalls: true,
    },
  }
}

async function getLiteLLMModelSettings(): Promise<{
  apiKey: string
  baseUrl: string
}> {
  const { secretKey } = await getKeySettings()
  if (!secretKey) {
    throw new HTTPError(
      "LiteLLM should be configured. Contact support if the issue persists.",
      500
    )
  }

  return {
    apiKey: secretKey,
    baseUrl: environment.LITELLM_URL,
  }
}
