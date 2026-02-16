import _ from "lodash"
import { ai } from "@budibase/pro"
import { MockLLMResponseFn, MockLLMResponseOpts } from "."
import { getPool } from "../../../../tests/jestEnv"

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

export const mockAzureOpenAIResponse: MockLLMResponseFn = (
  answer: string | ((prompt: string) => string),
  opts?: MockLLMResponseOpts
) => {
  const origin = opts?.baseUrl || "https://api.azure.com"
  const pool = getPool(origin)

  const expectedFormat = opts?.format
    ? _.matches({
        response_format: ai.parseResponseFormat(opts.format as any),
      })
    : null

  const interceptor = pool.intercept({
    path: /\/(v1\/responses|v1\/chat\/completions|deployments\/.*?\/chat\/completions)/,
    method: "POST",
  })
  interceptor.defaultReplyHeaders?.({
    "content-type": "application/json",
  })
  const scope = interceptor.reply<object>(reqOpts => {
    const reqBody = parseJsonBody(reqOpts.body)
    const path = reqOpts.path || ""
    const isResponsesApi = path.includes("/v1/responses")
    if (!isResponsesApi && expectedFormat && !expectedFormat(reqBody)) {
      return {
        statusCode: 200,
        data: {
          error: { message: "Unexpected response_format in request body" },
        },
      }
    }

    let prompt = ""
    if (isResponsesApi) {
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
    } else {
      const messages = reqBody?.messages as Message[]
      prompt = messages[0]?.content || ""
    }

    let content
    if (typeof answer === "function") {
      try {
        content = answer(prompt)
      } catch (e) {
        return {
          statusCode: 500,
          data: {
            error: {
              message: "Internal Server Error",
              type: "server_error",
              param: null,
              code: null,
            },
          },
        }
      }
    } else {
      content = answer
    }

    chatID++

    // We mock token usage because we use it to calculate Budibase AI quota
    // usage when Budibase AI is enabled, and some tests assert against quota
    // usage to make sure we're tracking correctly.
    const prompt_tokens = prompt ? prompt.split(SPACE_REGEX).length : 1
    const completion_tokens = content.split(SPACE_REGEX).length

    if (isResponsesApi) {
      return {
        statusCode: 200,
        data: {
          id: `resp_${chatID}`,
          created_at: Math.floor(Date.now() / 1000),
          model: reqBody?.model ?? "gpt-4o-realtime-preview-1001",
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
        },
      }
    }

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

    return {
      statusCode: 200,
      data: response,
    }
  })
  if (opts?.times != null) {
    scope.times(opts.times)
  }
}
