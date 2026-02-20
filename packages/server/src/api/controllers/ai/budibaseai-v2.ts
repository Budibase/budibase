import { env, HTTPError } from "@budibase/backend-core"
import { ChatCompletionRequestV2, type Ctx } from "@budibase/types"
import { bbai } from "../../../sdk/workspace/ai/llm"
import environment from "../../../environment"

interface StreamUsageState {
  sseBuffer: string
  usageCaptured: boolean
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
  if (!model?.startsWith("budibase/")) {
    throw new HTTPError(`Unsupported BBAI model: ${model}`, 400)
  }

  if (!environment.BBAI_LITELLM_KEY) {
    ctx.throw(500, "BBAI_LITELLM_KEY not configured")
  }

  const upstreamResponse = await fetch(
    `${environment.LITELLM_URL.replace(/\/$/, "")}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${environment.BBAI_LITELLM_KEY}`,
      },
      body: JSON.stringify(ctx.request.body),
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
