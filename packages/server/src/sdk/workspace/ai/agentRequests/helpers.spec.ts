import { generateText } from "ai"
import type { Agent, AgentRequest, LLMResponse } from "@budibase/types"
import sdk from "../../.."
import { analyzeAgentRequestLink } from "./helpers"

jest.mock("ai", () => ({
  generateText: jest.fn(),
}))

jest.mock("../../..", () => ({
  ai: {
    agents: {
      getOrThrow: jest.fn(),
    },
    llm: {
      createLLM: jest.fn(),
    },
  },
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

const buildAgent = (overrides: Partial<Agent> = {}): Agent => ({
  _id: "agent_1",
  name: "Support Agent",
  aiconfig: "config_1",
  operations: [],
  ...overrides,
})

const buildLLMResponse = (): LLMResponse =>
  ({
    chat: {} as LLMResponse["chat"],
    providerOptions: undefined,
    uploadFile: jest.fn(),
  }) as LLMResponse

const buildGenerateTextResult = (text: string) =>
  ({
    text,
  }) as Awaited<ReturnType<typeof generateText>>

describe("analyzeAgentRequestLink", () => {
  const generateTextMock = jest.mocked(generateText)
  const getOrThrowMock = jest.mocked(sdk.ai.agents.getOrThrow)
  const createLLMMock = jest.mocked(sdk.ai.llm.createLLM)

  beforeEach(() => {
    jest.clearAllMocks()
    getOrThrowMock.mockResolvedValue(buildAgent())
    createLLMMock.mockResolvedValue(buildLLMResponse())
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
    generateTextMock.mockResolvedValue(
      buildGenerateTextResult(
        JSON.stringify({
          decision: "existing_thread",
          requestId: "agentrequest_thread_1",
          entryAction: "append_latest_entry",
        })
      )
    )

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

  it("throws when the model returns an unknown request id", async () => {
    generateTextMock.mockResolvedValue(
      buildGenerateTextResult(
        JSON.stringify({
          decision: "existing_thread",
          requestId: "other_request",
          entryAction: "append_latest_entry",
        })
      )
    )

    await expect(
      analyzeAgentRequestLink({
        latestPrompt: "I need a new laptop",
        candidateRequests: [buildThread()],
        agentId: "agent_1",
        sessionId: "session_2",
      })
    ).rejects.toThrow(
      'Invalid agent request link response: unknown requestId "other_request"'
    )
  })

  it("throws when the model call fails", async () => {
    generateTextMock.mockRejectedValue(new Error("OpenAI API key is missing"))

    await expect(
      analyzeAgentRequestLink({
        latestPrompt: "I need a new laptop",
        candidateRequests: [buildThread()],
        agentId: "agent_1",
        sessionId: "session_2",
      })
    ).rejects.toThrow("OpenAI API key is missing")
  })

  it("throws when the model returns invalid output", async () => {
    generateTextMock.mockResolvedValue(buildGenerateTextResult("maybe same?"))

    await expect(
      analyzeAgentRequestLink({
        latestPrompt: "I need a new laptop",
        candidateRequests: [buildThread()],
        agentId: "agent_1",
        sessionId: "session_2",
      })
    ).rejects.toThrow("Invalid agent request link response")
  })
})
