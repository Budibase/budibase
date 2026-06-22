import { generateText } from "ai"
import type { AgentRequest } from "@budibase/types"
import { createBBAIClient } from "../llm/bbai"
import { analyzeAgentRequestLink } from "./helpers"

jest.mock("ai", () => ({
  generateText: jest.fn(),
}))

jest.mock("../llm/bbai", () => ({
  createBBAIClient: jest.fn().mockResolvedValue({
    chat: {},
    providerOptions: undefined,
  }),
}))

const buildThread = (overrides: Partial<AgentRequest> = {}): AgentRequest => ({
  _id: "agentrequest_thread_1",
  requestId: "agentrequest_thread_1",
  agentId: "agent_1",
  userId: "user_1",
  sessionIds: ["session_1"],
  entries: [
    {
      entryId: "entry_1",
      sessionId: "session_1",
      promptHistory: ["Show me the holidays company policy"],
      interactionCount: 1,
      status: "completed",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ],
  status: "completed",
  requestCount: 1,
  interactionCount: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  latestPromptAt: "2026-01-01T00:00:00.000Z",
  latestCompletedAt: "2026-01-01T00:00:00.000Z",
  latestSessionId: "session_1",
  ...overrides,
})

describe("analyzeAgentRequestLink", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(createBBAIClient as jest.Mock).mockResolvedValue({
      chat: {},
      providerOptions: undefined,
    })
  })

  it("creates a thread when there are no candidates", async () => {
    await expect(
      analyzeAgentRequestLink({
        latestPrompt: "Show me the holidays company policy",
        candidateRequests: [],
        agentId: "agent_1",
        sessionId: "session_1",
      })
    ).resolves.toEqual({ decision: "new_thread" })
  })

  it("links to an existing thread when bbai returns a valid thread id", async () => {
    ;(generateText as jest.Mock).mockResolvedValue({
      text: JSON.stringify({
        decision: "existing_thread",
        requestId: "agentrequest_thread_1",
        entryAction: "append_latest_entry",
      }),
    })

    await expect(
      analyzeAgentRequestLink({
        latestPrompt: "summarise it in 50 words",
        candidateRequests: [buildThread()],
        agentId: "agent_1",
        sessionId: "session_2",
      })
    ).resolves.toEqual({
      decision: "existing_thread",
      requestId: "agentrequest_thread_1",
      entryAction: "append_latest_entry",
    })
  })

  it("falls back to a new thread when bbai returns an unknown thread id", async () => {
    ;(generateText as jest.Mock).mockResolvedValue({
      text: JSON.stringify({
        decision: "existing_thread",
        requestId: "other_request",
        entryAction: "append_latest_entry",
      }),
    })

    await expect(
      analyzeAgentRequestLink({
        latestPrompt: "I need a new laptop",
        candidateRequests: [buildThread()],
        agentId: "agent_1",
        sessionId: "session_2",
      })
    ).resolves.toEqual({ decision: "new_thread" })
  })
})
