import { env } from "@budibase/backend-core"
import serverEnv from "../../../environment"
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

const allowedModels = new Set([
  "bbai-openai-gpt-5",
  "bbai-openai-gpt-4o-mini",
  "bbai-mistral-mistral-tiny",
])

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
    ctx.throw(500, "Budibase AI endpoints are not available in self-host")
  }

  const modelId = ctx.request.body.model
  if (!modelId) {
    ctx.throw(400, "Missing required field: model")
  }
  if (!allowedModels.has(modelId)) {
    ctx.throw(400, "Unsupported model")
  }

  const requestBody: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
    messages: ctx.request.body.messages,
    model: modelId,
    stream: !!ctx.request.body.stream,
  }

  const client = new OpenAIClient({
    apiKey: serverEnv.LITELLM_MASTER_KEY,
    baseURL: serverEnv.LITELLM_URL,
  })

  if (requestBody.stream) {
    try {
      const stream = await client.chat.completions.create(requestBody)

      ctx.status = 200
      ctx.set("Content-Type", "text/event-stream")
      ctx.set("Cache-Control", "no-cache")
      ctx.set("Connection", "keep-alive")

      ctx.res.setHeader("X-Accel-Buffering", "no")
      ctx.res.setHeader("Transfer-Encoding", "chunked")

      ctx.respond = false

      for await (const chunk of stream) {
        ctx.res.write(`data: ${JSON.stringify(chunk)}\n\n`)
      }
      ctx.res.write("data: [DONE]\n\n")
      ctx.res.end()
      return
    } catch (error: any) {
      if (ctx.res.headersSent) {
        ctx.res.write(
          `data: ${JSON.stringify({
            error: {
              message: env.isProd()
                ? "Streaming error"
                : error?.message || "Streaming error",
              type: "server_error",
            },
          })}\n\n`
        )
        ctx.res.end()
        return
      }

      ctx.throw(error?.status || 500, error?.message || "Streaming error")
    }
  }

  const response = await client.chat.completions.create(requestBody)
  ctx.body = response
}
