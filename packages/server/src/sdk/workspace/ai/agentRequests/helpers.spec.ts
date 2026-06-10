import { generateText } from "ai"
import type { AgentRequest } from "@budibase/types"
import { createBBAIClient } from "../llm/bbai"
import { analyzeAgentRequestBoundary } from "./helpers"

jest.mock("ai", () => ({
  generateText: jest.fn(),
}))

jest.mock("../llm/bbai", () => ({
  createBBAIClient: jest.fn().mockResolvedValue({
    chat: {},
    providerOptions: undefined,
  }),
}))

const buildRequest = (
  overrides: Partial<AgentRequest> = {}
): AgentRequest => ({
  _id: "agentrequest_agent_1_chat_1_req_1",
  agentId: "agent_1",
  sessionId: "session_1",
  userId: "user_1",
  promptHistory: ["Show me the holidays company policy"],
  status: "completed",
  interactionCount: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
})

describe("analyzeAgentRequestBoundary", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(createBBAIClient as jest.Mock).mockResolvedValue({
      chat: {},
      providerOptions: undefined,
    })
  })

  it("creates a request when there is no current request", async () => {
    await expect(
      analyzeAgentRequestBoundary({
        latestPrompt: "Show me the holidays company policy",
        agentId: "agent_1",
        sessionId: "session_1",
      })
    ).resolves.toEqual({ decision: "new_request" })
  })

  it("keeps prompts on the same request when bbai says it is a follow-up", async () => {
    ;(generateText as jest.Mock).mockResolvedValue({
      text: '{"decision":"same_request"}',
    })

    await expect(
      analyzeAgentRequestBoundary({
        latestPrompt: "summarise it in 50 words",
        currentRequest: buildRequest(),
        agentId: "agent_1",
        sessionId: "session_1",
      })
    ).resolves.toEqual({ decision: "same_request" })
  })

  it("creates a new request when bbai says the topic changed", async () => {
    ;(generateText as jest.Mock).mockResolvedValue({
      text: '{"decision":"new_request"}',
    })

    await expect(
      analyzeAgentRequestBoundary({
        latestPrompt: "I need a new laptop",
        currentRequest: buildRequest(),
        agentId: "agent_1",
        sessionId: "session_1",
      })
    ).resolves.toEqual({ decision: "new_request" })
  })

  it("falls back to a new request when bbai returns invalid output", async () => {
    ;(generateText as jest.Mock).mockResolvedValue({
      text: "maybe same?",
    })

    await expect(
      analyzeAgentRequestBoundary({
        latestPrompt: "I need a new laptop",
        currentRequest: buildRequest(),
        agentId: "agent_1",
        sessionId: "session_1",
      })
    ).resolves.toEqual({ decision: "new_request" })
  })
})
