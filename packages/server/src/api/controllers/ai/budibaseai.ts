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

class StreamTransform extends Transform {
  private buffer = ""
  private creditsSynced = false
  private remapReasoning: boolean

  constructor(opts?: { remapReasoning?: boolean }) {
    super()
    this.remapReasoning = opts?.remapReasoning ?? false
  }

  private processLine(line: string): string {
    if (!line.startsWith("data:")) {
      return line
    }
    const payload = line.slice(5).trim()
    if (!payload || payload === "[DONE]") {
      return line
    }
    try {
      const parsed = JSON.parse(payload)

      if (parsed?.usage && !this.creditsSynced) {
        this.creditsSynced = true
        incrementBudibaseAICreditsFromTokenUsage(
          toBudibaseUsage(parsed.usage)
        ).catch(error =>
          console.error("Failed to update credits from stream chunk", error)
        )
      }

      if (this.remapReasoning && parsed?.choices) {
        let modified = false
        for (const choice of parsed.choices) {
          if (choice.delta?.reasoning !== undefined) {
            choice.delta.reasoning_content = choice.delta.reasoning
            delete choice.delta.reasoning
            modified = true
          }
        }
        if (modified) {
          return `data: ${JSON.stringify(parsed)}`
        }
      }

      return line
    } catch {
      return line
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

    const output = lines.map(line => this.processLine(line)).join("\n") + "\n"
    callback(null, Buffer.from(output, "utf8"))
  }

  _flush(callback: TransformCallback) {
    if (this.buffer) {
      const output = this.processLine(this.buffer)
      this.buffer = ""
      callback(null, Buffer.from(output, "utf8"))
    } else {
      callback()
    }
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
    include_reasoning: true,
    reasoning_effort: body.reasoning_effort ?? "medium",
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

    const usageTrackingStream = new StreamTransform({
      remapReasoning: providerRequest.provider === "openrouter",
    })
    try {
      await pipeline(providerResponse.body, usageTrackingStream, ctx.res)
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (
        code === "ERR_STREAM_DESTROYED" ||
        code === "ECONNRESET" ||
        code === "EPIPE"
      ) {
        return
      }
      console.error("Stream pipeline error in chatCompletionV2", error)
      if (!ctx.res.writableEnded) {
        try {
          ctx.res.write(
            `data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`
          )
          ctx.res.end()
        } catch {
          // Response already closed between check and write
        }
      }
    }
    return
  }

  const json = (await providerResponse.json()) as {
    usage?: CompletionUsage
    choices?: Array<{ message?: { reasoning?: string } }>
  }
  await incrementBudibaseAICreditsFromTokenUsage(toBudibaseUsage(json.usage))

  if (providerRequest.provider === "openrouter" && json.choices) {
    for (const choice of json.choices) {
      if (choice.message?.reasoning !== undefined) {
        ;(choice.message as Record<string, unknown>).reasoning_content =
          choice.message.reasoning
        delete choice.message.reasoning
      }
    }
  }

  ctx.body = json
}
