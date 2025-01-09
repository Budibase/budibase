import nock from "nock"

let chatID = 1

export function mockChatGPTResponse(
  response: string | ((prompt: string) => string)
) {
  return nock("https://api.openai.com")
    .post("/v1/chat/completions")
    .reply(200, (uri, requestBody) => {
      let content = response
      if (typeof response === "function") {
        const messages = (requestBody as any).messages
        content = response(messages[0].content)
      }

      chatID++

      return {
        id: `chatcmpl-${chatID}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: "gpt-4o-mini",
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
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
          completion_tokens_details: {
            reasoning_tokens: 0,
            accepted_prediction_tokens: 0,
            rejected_prediction_tokens: 0,
          },
        },
      }
    })
    .persist()
}
