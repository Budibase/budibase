import { generateText } from "ai"
import type { Agent, AgentRequest, LLMResponse } from "@budibase/types"
import sdk from "../../.."
import { analyzeAgentRequestLink, generateAgentRequestTitle } from "./helpers"

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
  agentId: "agent_1",
  userId: "user_1",
  entries: [
    {
      promptHistory: [
        {
          message: "Show me the holidays company policy",
          date: "2026-01-01T00:00:00.000Z",
          sessionId: "session_1",
          source: "Chat",
          operations: [
            {
              name: "Support",
              prompt: "Help users with company policy questions.",
            },
          ],
        },
      ],
      status: "completed",
    },
  ],
  status: "completed",
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
        recentChatContext: [
          {
            role: "user",
            content: "Show me the holidays company policy",
          },
          {
            role: "assistant",
            content: "Here is the policy summary.",
          },
        ],
        agentId: "agent_1",
        sessionId: "session_2",
      })
    ).resolves.toEqual({
      decision: "existing_thread",
      requestId: "agentrequest_thread_1",
      entryAction: "append_latest_entry",
    })
    expect(createLLMMock).toHaveBeenCalledWith(
      "config_1",
      "session_2",
      undefined,
      "agent_1"
    )
    expect(generateTextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {
          "x-litellm-tags": "bb-agent-request-analyser",
        },
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: "user",
            content: JSON.stringify({
              currentSessionId: "session_2",
              latestPrompt: "summarise it in 50 words",
              recentChatContext: [
                {
                  role: "user",
                  content: "Show me the holidays company policy",
                },
                {
                  role: "assistant",
                  content: "Here is the policy summary.",
                },
              ],
              candidateRequests: [
                {
                  requestId: "agentrequest_thread_1",
                  status: "completed",
                  recentEntries: [
                    {
                      promptHistory: [
                        {
                          message: "Show me the holidays company policy",
                          date: "2026-01-01T00:00:00.000Z",
                          sessionId: "session_1",
                          source: "Chat",
                          operations: [
                            {
                              name: "Support",
                              prompt:
                                "Help users with company policy questions.",
                            },
                          ],
                        },
                      ],
                      status: "completed",
                    },
                  ],
                },
              ],
            }),
          }),
        ]),
      })
    )
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

describe("generateAgentRequestTitle", () => {
  const generateTextMock = jest.mocked(generateText)
  const getOrThrowMock = jest.mocked(sdk.ai.agents.getOrThrow)
  const createLLMMock = jest.mocked(sdk.ai.llm.createLLM)

  beforeEach(() => {
    jest.clearAllMocks()
    getOrThrowMock.mockResolvedValue(buildAgent())
    createLLMMock.mockResolvedValue(buildLLMResponse())
  })

  it("uses the operation as context while grounding the title in the user prompt", async () => {
    generateTextMock.mockResolvedValue(
      buildGenerateTextResult("Laptop recommendation")
    )

    const request = buildThread({
      entries: [
        {
          promptHistory: [
            {
              message: "I need a new laptop",
              date: "2026-01-01T00:00:00.000Z",
              sessionId: "session_1",
              source: "Chat",
              operations: [
                {
                  name: "Personalized Laptop Recommendation Search",
                  prompt:
                    "Help the user choose a suitable laptop based on their needs.",
                },
              ],
            },
          ],
          status: "completed",
        },
      ],
    })

    await expect(
      generateAgentRequestTitle({
        request,
        agentId: "agent_1",
        sessionId: "session_1",
        operation: {
          name: "Personalized Laptop Recommendation Search",
          prompt:
            "Help the user choose a suitable laptop based on their needs.",
        },
      })
    ).resolves.toEqual("Laptop recommendation")

    expect(generateTextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {
          "x-litellm-tags": "bb-agent-request-title",
        },
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: "system",
            content: expect.stringContaining(
              "Base it primarily on the user's actual ask"
            ),
          }),
          expect.objectContaining({
            role: "user",
            content: JSON.stringify({
              operation: {
                name: "Personalized Laptop Recommendation Search",
                prompt:
                  "Help the user choose a suitable laptop based on their needs.",
              },
              latestPrompt: {
                message: "I need a new laptop",
                date: "2026-01-01T00:00:00.000Z",
                sessionId: "session_1",
                source: "Chat",
                operations: [
                  {
                    name: "Personalized Laptop Recommendation Search",
                    prompt:
                      "Help the user choose a suitable laptop based on their needs.",
                  },
                ],
              },
              promptHistory: [
                {
                  message: "I need a new laptop",
                  date: "2026-01-01T00:00:00.000Z",
                  sessionId: "session_1",
                  source: "Chat",
                  operations: [
                    {
                      name: "Personalized Laptop Recommendation Search",
                      prompt:
                        "Help the user choose a suitable laptop based on their needs.",
                    },
                  ],
                },
              ],
            }),
          }),
        ]),
      })
    )
  })
})
