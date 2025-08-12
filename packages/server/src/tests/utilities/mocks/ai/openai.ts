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
  if (body && typeof (body as any).toString === "function") {
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

  const interceptor = pool.intercept({
    path: "/v1/chat/completions",
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
