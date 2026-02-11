import { env } from "@budibase/backend-core"
import { ai } from "@budibase/pro"
import {
  ChatCompletionRequestV2,
  type ChatCompletionRequest,
  type ChatCompletionResponse,
  type Ctx,
  type UploadFileRequest,
  type UploadFileResponse,
} from "@budibase/types"
import { bbai } from "../../../sdk/workspace/ai/llm"
import { generateText, streamText } from "ai"

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

  const { chat } = await bbai.createBBAIClient(model)

  if (stream) {
    try {
      const result = streamText({
        model: chat,
        messages,
        includeRawChunks: true,
      })

      ctx.status = 200
      ctx.set("Content-Type", "text/event-stream")
      ctx.set("Cache-Control", "no-cache")
      ctx.set("Connection", "keep-alive")

      ctx.res.setHeader("X-Accel-Buffering", "no")
      ctx.res.setHeader("Transfer-Encoding", "chunked")

      ctx.respond = false

      for await (const chunk of result.fullStream) {
        if (chunk.type !== "raw") continue
        ctx.res.write(`data: ${JSON.stringify(chunk.rawValue)}\n\n`)
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

  const result = await generateText({
    model: chat,
    messages,
  })
  ctx.body = result.response.body
}
