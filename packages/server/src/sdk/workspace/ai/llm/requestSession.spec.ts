import { getLiteLLMSessionId, withLiteLLMSessionId } from "./requestSession"

describe("withLiteLLMSessionId", () => {
  it("scopes session id to the wrapped call", async () => {
    await withLiteLLMSessionId("chatconvo_123", async () => {
      expect(getLiteLLMSessionId()).toBe("chatconvo_123")
    })
    expect(getLiteLLMSessionId()).toBeUndefined()
  })
})
