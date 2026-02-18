import AnthropicClient from "@anthropic-ai/sdk"
import nock from "nock"
import { getPool } from "../../../../tests/jestEnv"
import { MockLLMResponseFn, MockLLMResponseOpts } from "."

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

interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  system_fingerprint: string
  choices: Choice[]
  usage: Usage
}

function parseJsonBody(body: unknown) {
  if (typeof body === "string") return JSON.parse(body)
  if (body && typeof (body as any).toString === "function") {
    const s = String(body)
    try {
      return JSON.parse(s)
    } catch {
      /* ignore */
    }
  }
  return {}
}

export const mockAnthropicResponse: MockLLMResponseFn = (
  answer: string | ((prompt: string) => string),
  opts?: MockLLMResponseOpts
) => {
  const origin = opts?.baseUrl || "https://api.anthropic.com"

  nock(origin)
    .post("/v1/messages")
    .times(3)
    .reply((_, body: nock.Body) => {
      const req = body as AnthropicClient.MessageCreateParamsNonStreaming
      const prompt = req.messages[0].content
      if (typeof prompt !== "string") {
        throw new Error("Anthropic mock only supports string prompts")
      }

      let content
      if (typeof answer === "function") {
        try {
          content = answer(prompt)
        } catch {
          return [500, "Internal Server Error"]
        }
      } else {
        content = answer
      }

      const resp: AnthropicClient.Messages.Message = {
        id: `${chatID++}`,
        type: "message",
        role: "assistant",
        model: req.model,
        stop_reason: "end_turn",
        usage: {
          input_tokens: prompt.split(SPACE_REGEX).length,
          output_tokens: content.split(SPACE_REGEX).length,
        },
        stop_sequence: null,
        content: [{ type: "text", text: content }],
      }
      return [200, resp]
    })

  const pool = getPool(origin)
  const interceptor = pool.intercept({
    path: "/v1/chat/completions",
    method: "POST",
  })
  interceptor.defaultReplyHeaders?.({
    "content-type": "application/json",
  })
  const scope = interceptor.reply<object>(reqOpts => {
    const reqBody = parseJsonBody(reqOpts.body) as {
      model?: string
      messages?: Message[]
    }
    const prompt = reqBody.messages?.[0]?.content || ""

    let content
    if (typeof answer === "function") {
      try {
        content = answer(prompt)
      } catch {
        return {
          statusCode: 500,
          data: {
            error: { message: "Internal Server Error" },
          },
        }
      }
    } else {
      content = answer
    }

    const prompt_tokens = prompt.split(SPACE_REGEX).length
    const completion_tokens = content.split(SPACE_REGEX).length

    const response: ChatCompletionResponse = {
      id: `chatcmpl-${chatID++}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: reqBody.model || "claude-3-5-sonnet-20240620",
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

    return {
      statusCode: 200,
      data: response,
    }
  })

  scope.times(3)
}
