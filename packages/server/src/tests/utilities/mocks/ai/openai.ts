import nock from "nock"
import { MockLLMResponseFn, MockLLMResponseOpts } from "."
import _ from "lodash"
import { ai } from "@budibase/pro"

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

export const mockChatGPTResponse: MockLLMResponseFn = (
  answer: string | ((prompt: string) => string),
  opts?: MockLLMResponseOpts
) => {
  let body: any = undefined

  if (opts?.format) {
    body = _.matches({
      response_format: ai.parseResponseFormat(opts.format),
    })
  }
  return nock(opts?.baseUrl || "https://api.openai.com")
    .post("/v1/chat/completions", body)
    .reply((uri: string, body: nock.Body) => {
      const req = body as ChatCompletionRequest
      const messages = req.messages

      // Handle both simple string content and complex content arrays
      let prompt: string
      const messageContent = messages[0].content
      if (typeof messageContent === "string") {
        prompt = messageContent
      } else if (Array.isArray(messageContent)) {
        // Extract text content from complex content array
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
        model: req.model,
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
      return [200, response]
    })
    .persist()
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
  opts?: { status?: number; error?: any }
) => {
  if (opts?.error) {
    return nock("https://api.openai.com")
      .post("/v1/files")
      .reply(opts.status || 400, opts.error)
      .persist()
  }

  return nock("https://api.openai.com")
    .post("/v1/files")
    .reply((uri: string, body: any) => {
      const filename = body.filename || "test-file.pdf"

      const response: FileUploadResponse = {
        id: fileId,
        object: "file",
        bytes: 1024,
        created_at: Math.floor(Date.now() / 1000),
        filename: filename,
        purpose: "assistants",
      }
      return [200, response]
    })
    .persist()
}
