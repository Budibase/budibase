import { getPool } from "../../../../tests/jestEnv"
import _ from "lodash"
import { ai } from "@budibase/pro"
import { ResponseFormat } from "@budibase/types"
import { MockLLMResponseOpts } from "."

let chatID = 1
const SPACE_REGEX = /\s+/g

interface Message {
  role: string
  content: string | any[]
}

interface Choice {
  index: number
  message: Message
  logprobs: null
  finish_reason: string
}

interface CompletionTokensDetails {
  reasoning_tokens: number
  accepted_prediction_tokens: number
  rejected_prediction_tokens: number
}

interface Usage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  completion_tokens_details: CompletionTokensDetails
}

interface ChatCompletionRequest {
  messages: Message[]
  model: string
}

interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  system_fingerprint: string
  choices: Choice[]
  usage: Usage
}

function parseJsonBody(body: unknown): ChatCompletionRequest {
  if (typeof body === "string") return JSON.parse(body)
  if (body && typeof body.toString === "function") {
    const s = String(body)
    try {
      return JSON.parse(s)
    } catch {
      /* ignore */
    }
  }
  return { messages: [], model: "" }
}

export type MockLLMResponseFn = (
  answer: string | ((prompt: string) => string),
  opts?: MockLLMResponseOpts
) => void

export const mockChatGPTResponse: MockLLMResponseFn = (answer, opts) => {
  const origin = opts?.baseUrl || "https://api.openai.com"
  const pool = getPool(origin)

  const expectedFormat = opts?.format
    ? _.matches({
        response_format: ai.parseResponseFormat(opts.format as ResponseFormat),
      })
    : null
  const rejectFormat = opts?.rejectFormat

  const interceptor = pool.intercept({
    path: opts?.path || "/v1/chat/completions",
    method: "POST",
  })
  interceptor.defaultReplyHeaders({ "content-type": "application/json" })
  interceptor.reply(200, (reqOpts: any) => {
    const reqBody = parseJsonBody(reqOpts.body)
    if (expectedFormat && !expectedFormat(reqBody)) {
      return {
        error: { message: "Unexpected response_format in request body" },
      }
    }
    if (rejectFormat && "response_format" in reqBody) {
      return {
        error: { message: "Unexpected response_format in request body" },
      }
    }

    let prompt
    const messageContent = reqBody.messages[0].content
    if (typeof messageContent === "string") {
      prompt = messageContent
    } else if (Array.isArray(messageContent)) {
      const textParts = messageContent
        .filter((part: any) => part.type === "text")
        .map((part: any) => part.text)
      prompt = textParts.join(" ")
    } else {
      prompt = ""
    }

    let content
    if (typeof answer === "function") {
      try {
        content = answer(prompt)
      } catch (e) {
        return [500, "Internal Server Error"]
      }
    } else {
      content = answer
    }

    chatID++

    // We mock token usage because we use it to calculate Budibase AI quota
    // usage when Budibase AI is enabled, and some tests assert against quota
    // usage to make sure we're tracking correctly.
    const prompt_tokens = prompt.split(SPACE_REGEX).length
    const completion_tokens = content.split(SPACE_REGEX).length

    const response: ChatCompletionResponse = {
      id: `chatcmpl-${chatID}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: reqBody.model,
      system_fingerprint: `fp_${chatID}`,
      choices: [
        {
          index: 0,
          message: { role: "assistant", content },
          logprobs: null,
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens,
        completion_tokens,
        total_tokens: prompt_tokens + completion_tokens,
        completion_tokens_details: {
          reasoning_tokens: 0,
          accepted_prediction_tokens: 0,
          rejected_prediction_tokens: 0,
        },
      },
    }

    return response
  }) // Each mock call handles one request
}

export const mockOpenAIResponsesResponse: MockLLMResponseFn = (
  answer,
  opts
) => {
  const origin = opts?.baseUrl || "https://api.openai.com"
  const pool = getPool(origin)

  const interceptor = pool.intercept({
    path: "/v1/responses",
    method: "POST",
  })
  interceptor.defaultReplyHeaders?.({
    "content-type": "application/json",
  })
  interceptor.reply(200, (reqOpts: any) => {
    const reqBody = parseJsonBody(reqOpts.body)

    let prompt = ""
    const input = reqBody && "input" in reqBody && reqBody.input
    if (Array.isArray(input)) {
      const userMessage = input.find((item: any) => item.role === "user")
      const content = userMessage?.content
      if (Array.isArray(content)) {
        prompt = content
          .filter((part: any) => part.type === "input_text")
          .map((part: any) => part.text)
          .join(" ")
      }
    }

    let content
    if (typeof answer === "function") {
      try {
        content = answer(prompt)
      } catch (e: any) {
        return [500, e.message]
      }
    } else {
      content = answer
    }

    chatID++

    const prompt_tokens = prompt ? prompt.split(SPACE_REGEX).length : 1
    const completion_tokens = content.split(SPACE_REGEX).length

    return {
      id: `resp_${chatID}`,
      created_at: Math.floor(Date.now() / 1000),
      model: reqBody?.model ?? "gpt-5-mini",
      output: [
        {
          type: "message",
          role: "assistant",
          id: `msg_${chatID}`,
          content: [
            {
              type: "output_text",
              text: content,
              annotations: [],
            },
          ],
        },
      ],
      usage: {
        input_tokens: prompt_tokens,
        input_tokens_details: { cached_tokens: 0 },
        output_tokens: completion_tokens,
        output_tokens_details: { reasoning_tokens: 0 },
      },
    }
  })
}

export const mockChatGPTStreamResponse = (
  content = "hi",
  options?: { baseUrl?: string }
) => {
  const origin = options?.baseUrl || "https://api.openai.com"
  const pool = getPool(origin)

  const interceptor = pool.intercept({
    path: "/v1/chat/completions",
    method: "POST",
  })
  interceptor.defaultReplyHeaders({
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive",
  })
  interceptor.reply(200, (reqOpts: any) => {
    const prompt = getPromptFromRequest(reqOpts.body)

    // We mock token usage because we use it to calculate Budibase AI quota
    // usage when Budibase AI is enabled, and some tests assert against quota
    // usage to make sure we're tracking correctly.
    const prompt_tokens = prompt.split(SPACE_REGEX).length
    const completion_tokens = content.split(SPACE_REGEX).length

    const chunks = [
      `data: ${JSON.stringify({
        id: "chatcmpl-test",
        object: "chat.completion.chunk",
        created: Math.floor(Date.now() / 1000),
        model: "gpt-5-mini",
        choices: [{ index: 0, delta: { content } }],
      })}\n\n`,
      `data: ${JSON.stringify({
        id: "chatcmpl-test",
        object: "chat.completion.chunk",
        created: Math.floor(Date.now() / 1000),
        model: "gpt-5-mini",
        choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
        usage: {
          prompt_tokens: prompt_tokens,
          completion_tokens: completion_tokens,
          total_tokens: prompt_tokens + completion_tokens,
          completion_tokens_details: {
            reasoning_tokens: 0,
            accepted_prediction_tokens: 0,
            rejected_prediction_tokens: 0,
          },
        },
      })}\n\n`,
      "data: [DONE]\n\n",
    ]

    return chunks.join("")
  })
}

const getPromptFromRequest = (body: unknown): string => {
  const reqBody = parseJsonBody(body)
  const messageContent = reqBody.messages?.[0]?.content
  if (typeof messageContent === "string") {
    return messageContent
  }
  if (Array.isArray(messageContent)) {
    return messageContent
      .filter((part: any) => part.type === "text")
      .map((part: any) => part.text)
      .join(" ")
  }
  return ""
}

export const mockChatGPTStreamFailure = (opts?: {
  baseUrl?: string
  status?: number
  errorMessage?: string
}) => {
  const origin = opts?.baseUrl || "https://api.openai.com"
  const pool = getPool(origin)

  const interceptor = pool.intercept({
    path: "/v1/chat/completions",
    method: "POST",
  })

  interceptor.defaultReplyHeaders({
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive",
  })
  interceptor.reply(200, () => {
    return [
      `data: ${JSON.stringify({ id: "chatcmpl-test", choices: [{ delta: { content: "hi" } }] })}\n\n`,
      `data: ${JSON.stringify({ error: { message: opts?.errorMessage || "stream failure", type: "server_error" } })}\n\n`,
      "data: [DONE]\n\n",
    ].join("")
  })
}

interface FileUploadResponse {
  id: string
  object: string
  bytes: number
  created_at: number
  filename: string
  purpose: string
}

export const mockOpenAIFileUpload = (
  fileId = "file-test123",
  opts?: { status?: number; error?: any; baseUrl?: string }
) => {
  const origin = opts?.baseUrl || "https://api.openai.com"
  const pool = getPool(origin)

  if (opts?.error) {
    const interceptor = pool.intercept({ path: "/v1/files", method: "POST" })
    interceptor.defaultReplyHeaders({ "content-type": "application/json" })
    interceptor.reply(opts.status || 400, opts.error)
    return
  }

  const interceptor = pool.intercept({ path: "/v1/files", method: "POST" })
  interceptor.defaultReplyHeaders({ "content-type": "application/json" })
  interceptor.reply(200, () => {
    // We don't parse multipart; tests only assert returned id.
    const response: FileUploadResponse = {
      id: fileId,
      object: "file",
      bytes: 1024,
      created_at: Math.floor(Date.now() / 1000),
      filename: "test-file.pdf",
      purpose: "assistants",
    }
    return response
  })
}
