import { env } from "@budibase/backend-core"
import { ai } from "@budibase/pro"
import OpenAIClient from "openai"
import type OpenAI from "openai"
import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  Ctx,
  UploadFileRequest,
  UploadFileResponse,
} from "@budibase/types"

export async function uploadFile(
  ctx: Ctx<UploadFileRequest, UploadFileResponse>
) {
  if (env.SELF_HOSTED) {
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

export async function chatCompletion(
  ctx: Ctx<ChatCompletionRequest, ChatCompletionResponse>
) {
  if (env.SELF_HOSTED) {
    ctx.throw(500, "Budibase AI endpoints are not available in self-host")
  }

  const llm = await ai.getLLMOrThrow()
  ctx.body = await llm.chat(ai.LLMRequest.fromRequest(ctx.request.body))
}

export async function openaiChatCompletions(
  ctx: Ctx<
    OpenAI.Chat.Completions.ChatCompletionCreateParams,
    OpenAI.Chat.Completions.ChatCompletion
  >
) {
  if (!ctx.request.body?.messages?.length) {
    ctx.throw(400, "Missing required field: messages")
  }

  if (env.SELF_HOSTED && !env.isDev()) {
    ctx.throw(500, "OpenAI-compatible endpoint is not available in self-host")
  }

  const llmConfig = await ai.getLLMConfig()
  const apiKey = llmConfig?.apiKey || env.OPENAI_API_KEY
  if (!apiKey) {
    ctx.throw(500, "No OpenAI API key configured")
  }

  const client = new OpenAIClient({
    apiKey,
    ...(llmConfig?.baseUrl ? { baseURL: llmConfig.baseUrl } : {}),
  })

  const requestBody = {
    ...ctx.request.body,
    model: ctx.request.body.model || llmConfig?.model,
  }

  if (ctx.request.body.stream) {
    ctx.status = 200
    ctx.set("Content-Type", "text/event-stream")
    ctx.set("Cache-Control", "no-cache")
    ctx.set("Connection", "keep-alive")

    ctx.res.setHeader("X-Accel-Buffering", "no")
    ctx.res.setHeader("Transfer-Encoding", "chunked")

    ctx.respond = false

    try {
      const stream = await client.chat.completions.create({
        ...(requestBody as OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming),
        stream: true,
      })

      for await (const chunk of stream) {
        ctx.res.write(`data: ${JSON.stringify(chunk)}\n\n`)
      }
      ctx.res.write("data: [DONE]\n\n")
      ctx.res.end()
      return
    } catch (error: any) {
      ctx.res.write(
        `data: ${JSON.stringify({
          error: {
            message: error?.message || "Streaming error",
            type: "server_error",
          },
        })}\n\n`
      )
      ctx.res.end()
    }
    return
  }

  const response = await client.chat.completions.create(
    requestBody as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming
  )
  ctx.body = response as unknown as OpenAIChatCompletionsResponse
}
