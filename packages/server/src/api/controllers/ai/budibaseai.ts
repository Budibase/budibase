import { env } from "@budibase/backend-core"
import { ai } from "@budibase/pro"
import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  Ctx,
  Message,
  ResponseFormat,
  UploadFileRequest,
  UploadFileResponse,
} from "@budibase/types"

interface OpenAIFormatJSONSchema {
  type: "json_schema"
  json_schema: {
    name: string
    schema: Record<string, unknown>
    strict?: boolean
  }
}

type OpenAIFormat =
  | { type: "text" }
  | { type: "json_object" }
  | OpenAIFormatJSONSchema

interface OpenAIChatCompletionsRequest {
  messages: Message[]
  model?: string
  response_format?: OpenAIFormat
}

interface OpenAIChatCompletionsResponse {
  id: string
  object: "chat.completion"
  created: number
  model: string
  choices: {
    index: number
    message: {
      role: "assistant"
      content: string
    }
    finish_reason: "stop"
  }[]
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

function mapResponseFormat(format?: OpenAIFormat): ResponseFormat | undefined {
  if (!format) {
    return
  }

  switch (format.type) {
    case "text":
      return "text"
    case "json_object":
      return "json"
    case "json_schema":
      return format
    default:
      return
  }
}

function extractTextFromContent(content: Message["content"]) {
  if (typeof content === "string") {
    return content
  }

  if (!Array.isArray(content)) {
    return ""
  }

  return content
    .map(part => {
      if (part && typeof part === "object" && "text" in part) {
        const text = (part as { text?: unknown }).text
        return typeof text === "string" ? text : ""
      }
      return ""
    })
    .join("")
}

function findAssistantText(messages: Message[]) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (message.role === "assistant") {
      return extractTextFromContent(message.content)
    }
  }
  return ""
}

function buildResponseId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`
}

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
  ctx: Ctx<OpenAIChatCompletionsRequest, OpenAIChatCompletionsResponse>
) {
  if (!ctx.request.body?.messages?.length) {
    ctx.throw(400, "Missing required field: messages")
  }

  if (env.SELF_HOSTED && !env.isDev()) {
    ctx.throw(500, "OpenAI-compatible endpoint is not available in self-host")
  }

  const llm = await ai.getLLMOrThrow()
  const request = new ai.LLMRequest()

  request.addMessages(ctx.request.body.messages)
  const responseFormat = mapResponseFormat(ctx.request.body.response_format)
  if (responseFormat) {
    request.withFormat(responseFormat)
  }

  const response = await llm.chat(request)
  const assistantText = findAssistantText(response.messages)
  const created = Math.floor(Date.now() / 1000)

  ctx.body = {
    id: buildResponseId("chatcmpl"),
    object: "chat.completion",
    created,
    model: ctx.request.body.model || llm.model,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: assistantText,
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: response.tokensUsed || 0,
    },
  }
}
