import type { AgentRequest } from "@budibase/types"
import { shouldCreateNewAgentRequest } from "./helpers"

const buildRequest = (
  overrides: Partial<AgentRequest> = {}
): AgentRequest => ({
  _id: "agentrequest_agent_1_chat_1_req_1",
  agentId: "agent_1",
  chatConversationId: "chat_1",
  userId: "user_1",
  promptHistory: ["Show me the holidays company policy"],
  status: "completed",
  interactionCount: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
})

describe("shouldCreateNewAgentRequest", () => {
  it("creates a request when there is no current request", () => {
    expect(
      shouldCreateNewAgentRequest({
        latestPrompt: "Show me the holidays company policy",
      })
    ).toBe(true)
  })

  it("keeps short contextual follow-ups on the same request", () => {
    expect(
      shouldCreateNewAgentRequest({
        latestPrompt: "summarise it in 50 words",
        currentRequest: buildRequest(),
      })
    ).toBe(false)
  })

  it("creates a new request when the topic clearly changes", () => {
    expect(
      shouldCreateNewAgentRequest({
        latestPrompt: "I need a new laptop",
        currentRequest: buildRequest(),
      })
    ).toBe(true)
  })
})
