import { context, env, HTTPError } from "@budibase/backend-core"
import { ChatCompletionRequestV2, type Ctx } from "@budibase/types"
import { quotas } from "@budibase/pro"
import { bbai } from "../../../sdk/workspace/ai/llm"
import environment from "../../../environment"

interface StreamUsageState {
  sseBuffer: string
  usageCaptured: boolean
}

const allowedChatCompletionFields = new Set([
  "audio",
  "frequency_penalty",
  "function_call",
  "functions",
  "logit_bias",
  "logprobs",
  "max_completion_tokens",
  "max_tokens",
  "messages",
  "metadata",
  "modalities",
  "model",
  "n",
  "parallel_tool_calls",
  "prediction",
  "presence_penalty",
  "prompt_cache_key",
  "prompt_cache_retention",
  "reasoning_effort",
  "response_format",
  "safety_identifier",
  "seed",
  "service_tier",
  "stop",
  "store",
  "stream",
  "stream_options",
  "temperature",
  "tool_choice",
  "tools",
  "top_logprobs",
  "top_p",
  "user",
  "verbosity",
  "web_search_options",
])

const getBBAITags = () => {
  const tags = ["bbai-self"]
  try {
    const tenantId = context.getTenantId()
    if (tenantId) {
      tags.push(`tenant:${tenantId}`)
    }
  } catch {
    //
  }
  const workspaceId = context.getWorkspaceId()
  if (workspaceId) {
    tags.push(`workspace:${workspaceId}`)
  }
  return tags
}

async function parseStreamUsageFromChunk(
  decodedChunk: string,
  state: StreamUsageState
) {
  if (state.usageCaptured) {
    return
  }

  state.sseBuffer += decodedChunk
  let newLineIndex = state.sseBuffer.indexOf("\n")

  while (newLineIndex !== -1) {
    const line = state.sseBuffer.slice(0, newLineIndex).trim()
    state.sseBuffer = state.sseBuffer.slice(newLineIndex + 1)

    if (line.startsWith("data: ")) {
      const data = line.slice(6)
      if (data && data !== "[DONE]") {
        try {
          const parsed = JSON.parse(data)
          if (parsed?.usage) {
            state.usageCaptured = true
            await bbai
              .incrementBudibaseAICreditsFromOpenAIUsage(parsed.usage)
              .catch(() => {})
          }
        } catch {
          // ignore partial or non-JSON event lines
        }
      }
    }

    newLineIndex = state.sseBuffer.indexOf("\n")
  }
}

export async function chatCompletionV2(ctx: Ctx<ChatCompletionRequestV2>) {
  const { messages, model, stream } = ctx.request.body

  if (!messages?.length) {
    ctx.throw(400, "Missing required field: messages")
  }

  if (env.SELF_HOSTED && !env.isDev()) {
    ctx.throw(500, "Budibase AI endpoints are not available in self-host")
  }

  if (!model) {
    ctx.throw(400, "Missing required field: model")
  }
  if (model !== "budibase/v1") {
    throw new HTTPError(`Unsupported BBAI model: ${model}`, 400)
  }

  const requestBody: Record<string, unknown> = {}
  for (const [field, value] of Object.entries(ctx.request.body)) {
    if (!allowedChatCompletionFields.has(field)) {
      ctx.throw(400, `Unsupported chat completion field: ${field}`)
    }
    if (field !== "metadata") {
      requestBody[field] = value
    }
  }
  requestBody.metadata = {
    ...ctx.request.body.metadata,
    tags: getBBAITags(),
  }

  const bbaiKey = bbai.getBBAIKey()

  await quotas.throwIfBudibaseAICreditsExceeded()

  const upstreamResponse = await fetch(
    `${environment.LITELLM_URL.replace(/\/$/, "")}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bbaiKey}`,
      },
      body: JSON.stringify(requestBody),
    }
  )

  if (stream) {
    if (!upstreamResponse.body) {
      ctx.throw(500, "Streaming error")
    }

    const decoder = new TextDecoder()
    const reader = upstreamResponse.body.getReader()
    const streamUsageState: StreamUsageState = {
      sseBuffer: "",
      usageCaptured: false,
    }

    ctx.respond = false
    ctx.res.statusCode = upstreamResponse.status
    upstreamResponse.headers.forEach((value, key) => {
      ctx.res.setHeader(key, value)
    })

    try {
      for (;;) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }

        await parseStreamUsageFromChunk(
          decoder.decode(value, { stream: true }),
          streamUsageState
        )

        ctx.res.write(value)
      }

      ctx.res.end()
      return
    } catch (error: any) {
      if (!ctx.res.headersSent) {
        ctx.throw(error?.status || 500, error?.message || "Streaming error")
      }
      ctx.res.end()
      return
    }
  }

  const responseBodyText = await upstreamResponse.text()
  const contentType = upstreamResponse.headers.get("content-type")

  ctx.status = upstreamResponse.status
  if (contentType) {
    ctx.set("Content-Type", contentType)
  }

  try {
    const parsedBody = JSON.parse(responseBodyText)
    if (parsedBody?.usage) {
      await bbai
        .incrementBudibaseAICreditsFromOpenAIUsage(parsedBody.usage)
        .catch(() => {})
    }
    ctx.body = parsedBody
  } catch {
    ctx.body = responseBodyText
  }
}
