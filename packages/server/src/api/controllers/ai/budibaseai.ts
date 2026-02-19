import { env } from "@budibase/backend-core"
import { ai, quotas } from "@budibase/pro"
import {
  AIQuotaUsageResponse,
  ChatCompletionRequestV2,
  type ChatCompletionRequest,
  type ChatCompletionResponse,
  type Ctx,
  type UploadFileRequest,
  type UploadFileResponse,
} from "@budibase/types"
import nodeFetch from "node-fetch"
import { Transform, type TransformCallback } from "stream"
import { pipeline } from "stream/promises"
import {
  incrementBudibaseAICreditsFromTokenUsage,
  resolveBudibaseAIProviderRequest,
} from "../../../sdk/workspace/ai/llm/bbaiShared"

export async function uploadFile(
  ctx: Ctx<UploadFileRequest, UploadFileResponse>
) {
  if (env.SELF_HOSTED && !env.isDev()) {
    ctx.throw(500, "Budibase AI endpoints are not available in self-host")
  }
  const llm = await ai.getLLMOrThrow()

  const data = Buffer.from(ctx.request.body.data, "base64")

  const response = await llm.uploadFile(
    data,
    ctx.request.body.filename,
    ctx.request.body.contentType
  )
  ctx.body = {
    file: response,
  }
}

export async function getAIQuotaUsage(ctx: Ctx<void, AIQuotaUsageResponse>) {
  const usage = await quotas.getQuotaUsage()
  const monthlyCredits = usage?.monthly?.current?.budibaseAICredits ?? 0
  ctx.body = { monthlyCredits }
}

export async function chatCompletion(
  ctx: Ctx<ChatCompletionRequest, ChatCompletionResponse>
) {
  if (env.SELF_HOSTED && !env.isDev()) {
    ctx.throw(500, "Budibase AI endpoints are not available in self-host")
  }

  const llm = await ai.getLLMOrThrow()
  ctx.body = await llm.chat(ai.LLMRequest.fromRequest(ctx.request.body))
}

type CompletionUsage = {
  prompt_tokens?: number
  completion_tokens?: number
}

const toBudibaseUsage = (
  usage?: CompletionUsage
): { inputTokens: number; outputTokens: number } | undefined => {
  if (!usage) {
    return
  }
  return {
    inputTokens: usage.prompt_tokens ?? 0,
    outputTokens: usage.completion_tokens ?? 0,
  }
}

const tryReadProviderErrorMessage = async (
  response: Awaited<ReturnType<typeof nodeFetch>>
) => {
  try {
    const text = await response.text()
    if (!text) {
      return response.statusText
    }
    try {
      const parsed = JSON.parse(text)
      return (
        parsed?.error?.message ||
        parsed?.message ||
        parsed?.error ||
        response.statusText
      )
    } catch {
      return text
    }
  } catch {
    return response.statusText
  }
}

class UsageTrackingTransform extends Transform {
  private buffer = ""
  private creditsSynced = false

  private processLines(lines: string[]) {
    for (const line of lines) {
      if (!line.startsWith("data:")) {
        continue
      }
      const payload = line.slice(5).trim()
      if (!payload || payload === "[DONE]" || this.creditsSynced) {
        continue
      }
      try {
        const parsed = JSON.parse(payload)
        if (parsed?.usage) {
          this.creditsSynced = true
          incrementBudibaseAICreditsFromTokenUsage(
            toBudibaseUsage(parsed.usage)
          ).catch(error =>
            console.error("Failed to update credits from stream chunk", error)
          )
        }
      } catch {
        // Ignore non-json chunks.
      }
    }
  }

  _transform(
    chunk: Buffer,
    _encoding: NodeJS.BufferEncoding,
    callback: TransformCallback
  ) {
    this.buffer += chunk.toString("utf8")

    const lines = this.buffer.split("\n")
    this.buffer = lines.pop() ?? ""

    this.processLines(lines)
    callback(null, chunk)
  }

  _flush(callback: TransformCallback) {
    if (this.buffer) {
      this.processLines([this.buffer])
      this.buffer = ""
    }
    callback()
  }
}

export async function chatCompletionV2(ctx: Ctx<ChatCompletionRequestV2>) {
  const body = ctx.request.body
  const messages = body.messages
  const model = body.model
  const stream = body.stream === true

  if (!messages?.length) {
    ctx.throw(400, "Missing required field: messages")
  }

  if (env.SELF_HOSTED && !env.isDev()) {
    ctx.throw(500, "Budibase AI endpoints are not available in self-host")
  }

  if (!model) {
    ctx.throw(400, "Missing required field: model")
  }

  const providerRequest = resolveBudibaseAIProviderRequest(model)

  const providerUrl = `${providerRequest.baseUrl.replace(/\/$/, "")}/chat/completions`
  const providerBody = {
    ...body,
    model: providerRequest.model,
    stream,
    ...(stream && { stream_options: { include_usage: true } }),
  }
  const providerResponse = await nodeFetch(providerUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${providerRequest.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(providerBody),
  })

  if (!providerResponse.ok) {
    const message = await tryReadProviderErrorMessage(providerResponse)
    ctx.throw(providerResponse.status, message || "Provider request failed")
  }

  if (stream) {
    if (!providerResponse.body) {
      ctx.throw(500, "Provider returned no response body")
    }

    ctx.status = providerResponse.status
    ctx.set("Content-Type", "text/event-stream")
    ctx.set("Cache-Control", "no-cache, no-transform")
    ctx.set("Connection", "keep-alive")
    ctx.res.setHeader("X-Accel-Buffering", "no")
    ctx.respond = false

    const usageTrackingStream = new UsageTrackingTransform()
    await pipeline(providerResponse.body, usageTrackingStream, ctx.res)
    return
  }

  const json = (await providerResponse.json()) as {
    usage?: CompletionUsage
  }
  await incrementBudibaseAICreditsFromTokenUsage(toBudibaseUsage(json.usage))
  ctx.body = json
}
