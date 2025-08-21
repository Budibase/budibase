import AnthropicClient from "@anthropic-ai/sdk"
import nock from "nock"
import { MockLLMResponseFn, MockLLMResponseOpts } from "."

let chatID = 1
const SPACE_REGEX = /\s+/g

export const mockAnthropicResponse: MockLLMResponseFn = (
  answer: string | ((prompt: string) => string),
  opts?: MockLLMResponseOpts
) => {
  return nock(opts?.baseUrl || "https://api.anthropic.com")
    .post("/v1/messages")
    .reply((uri: string, body: nock.Body) => {
      const req = body as AnthropicClient.MessageCreateParamsNonStreaming
      const prompt = req.messages[0].content
      if (typeof prompt !== "string") {
        throw new Error("Anthropic mock only supports string prompts")
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
    .persist()
}
