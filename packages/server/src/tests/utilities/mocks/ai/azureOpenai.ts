import nock from "nock"
import { MockLLMResponseFn, MockLLMResponseOpts } from "."
import _ from "lodash"
import { ai } from "@budibase/pro"

let chatID = 1
const SPACE_REGEX = /\s+/g

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

export const mockAzureOpenAIResponse: MockLLMResponseFn = (
  answer: string | ((prompt: string) => string),
  opts?: MockLLMResponseOpts
) => {
  let body: any = undefined

  if (opts?.format) {
    body = _.matches({
      response_format: ai.parseResponseFormat(opts.format),
    })
  }
  return nock(opts?.baseUrl || "https://api.azure.com")
    .post(new RegExp("/deployments/.*?/chat/completions"), body)
    .reply((uri: string, body: nock.Body) => {
      const req = body as ChatCompletionRequest
      const messages = req.messages
      const prompt = messages[0].content

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
      const prompt_tokens = messages[0].content.split(SPACE_REGEX).length
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
