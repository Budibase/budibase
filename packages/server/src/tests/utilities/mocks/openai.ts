import nock from "nock"

let chatID = 1
const SPACE_REGEX = /\s+/g

interface MockChatGPTResponseOpts {
  host?: string
}

interface Message {
  role: string
  content: string
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

export function mockChatGPTResponse(
  answer: string | ((prompt: string) => string),
  opts?: MockChatGPTResponseOpts
) {
  return nock(opts?.host || "https://api.openai.com")
    .post("/v1/chat/completions")
    .reply(200, (uri: string, requestBody: ChatCompletionRequest) => {
      const messages = requestBody.messages
      const prompt = messages[0].content

      let content
      if (typeof answer === "function") {
        content = answer(prompt)
      } else {
        content = answer
      }

      chatID++

      // We mock token usage because we use it to calculate Budibase AI quota
      // usage when Budibase AI is enabled, and some tests assert against quota
      // usage to make sure we're tracking correctly.
      const prompt_tokens = messages[0].content.split(SPACE_REGEX).length
      const completion_tokens = content.split(SPACE_REGEX).length

      const response: ChatCompletionResponse = {
        id: `chatcmpl-${chatID}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: requestBody.model,
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
    })
    .persist()
}

export function mockChatGPTError() {
  return nock("https://api.openai.com")
    .post("/v1/chat/completions")
    .reply(500, "Internal Server Error")
    .persist()
}
