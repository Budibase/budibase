import type { ContextUser } from "@budibase/types"
import { runSuite } from "./run"

jest.mock("@budibase/backend-core", () => ({
  features: {
    isEnabled: jest.fn().mockResolvedValue(false),
  },
  getErrorMessage: jest.fn((error: unknown) =>
    error instanceof Error ? error.message : String(error)
  ),
  HTTPError: class HTTPError extends Error {
    status: number

    constructor(message: string, status: number) {
      super(message)
      this.status = status
    }
  },
}))

jest.mock("@budibase/pro", () => ({
  ai: {
    agentSystemPrompt: jest.fn().mockReturnValue("Base system prompt"),
  },
  quotas: {
    addAction: jest.fn().mockImplementation((fn: () => Promise<void>) => fn()),
  },
}))

jest.mock("../../..", () => ({
  __esModule: true,
  default: {
    ai: {
      agents: {
        getOrThrow: jest.fn(),
        buildPromptAndTools: jest.fn(),
      },
      configs: {
        find: jest.fn(),
      },
      llm: {
        createLLM: jest.fn(),
      },
    },
  },
}))

jest.mock("../agentLogs", () => ({
  createSessionLogIndexer: jest.fn(),
}))

jest.mock("../agents", () => ({
  formatIncompleteToolCallError: jest
    .fn()
    .mockReturnValue("Incomplete tool call"),
  updatePendingToolCalls: jest.fn(),
}))

jest.mock("../rag", () => ({
  retrieveContextForAgent: jest.fn(),
}))

jest.mock("./crud", () => ({
  fetchSuite: jest.fn(),
  saveRun: jest.fn(),
}))

jest.mock("ai", () => ({
  Output: {
    object: jest.fn().mockReturnValue({}),
  },
  ToolLoopAgent: jest.fn(),
  extractReasoningMiddleware: jest.fn().mockReturnValue({}),
  jsonSchema: jest.fn((schema: unknown) => schema),
  stepCountIs: jest.fn().mockReturnValue(() => false),
  streamText: jest.fn(),
  wrapLanguageModel: jest.fn().mockReturnValue({}),
}))

describe("agent eval runner", () => {
  const sdk = jest.requireMock("../../..").default
  const ai = jest.requireMock("ai")
  const { createSessionLogIndexer } = jest.requireMock("../agentLogs")
  const { fetchSuite, saveRun } = jest.requireMock("./crud")
  const user = {} as ContextUser

  const makeIndexer = () => ({
    addRequestId: jest.fn(),
    index: jest.fn().mockResolvedValue(undefined),
  })

  const mockAgentRun = (response: string) => {
    ai.streamText.mockImplementation(
      ({
        onStepFinish,
        onFinish,
      }: {
        onStepFinish?: (result: {
          content: unknown[]
          toolCalls: unknown[]
          toolResults: unknown[]
          response: { id: string }
        }) => void
        onFinish?: (result: { response: { id: string } }) => void
      }) => {
        onStepFinish?.({
          content: [],
          toolCalls: [],
          toolResults: [],
          response: {
            id: "agent-request",
          },
        })
        onFinish?.({
          response: {
            id: "agent-request",
          },
        })

        return {
          text: Promise.resolve(response),
          response: Promise.resolve({
            id: "agent-request",
          }),
        }
      }
    )
  }

  const mockJudgeRun = (
    result: { passed: boolean; reason: string } | Error
  ) => {
    ai.ToolLoopAgent.mockImplementation(
      ({
        onStepFinish,
      }: {
        onStepFinish?: (result: { response: { id: string } }) => void
      }) => ({
        stream: jest.fn().mockImplementation(async () => {
          onStepFinish?.({
            response: {
              id: "judge-request",
            },
          })

          return {
            output:
              result instanceof Error
                ? Promise.reject(result)
                : Promise.resolve(result),
            response: Promise.resolve({
              id: "judge-request",
            }),
          }
        }),
      })
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()

    sdk.ai.agents.getOrThrow.mockResolvedValue({
      _id: "agent-1",
      name: "Support Agent",
      aiconfig: "config-1",
      enabledTools: [],
      knowledgeBases: [],
    })
    sdk.ai.agents.buildPromptAndTools.mockResolvedValue({
      systemPrompt: "You are a helpful assistant.",
      tools: {},
    })
    sdk.ai.configs.find.mockResolvedValue({
      _id: "config-1",
      name: "Primary config",
      provider: "openai",
      model: "gpt-5",
      liteLLMModelId: "openai/gpt-5",
      reasoningEffort: "medium",
    })
    sdk.ai.llm.createLLM.mockResolvedValue({
      chat: {},
      providerOptions: jest.fn().mockReturnValue(undefined),
    })
    fetchSuite.mockResolvedValue({
      agentId: "agent-1",
      cases: [
        {
          id: "case-1",
          name: "Friendly greeting",
          prompt: "Say hello",
          assertions: {
            contains: ["hello"],
            judge: {
              rubric: "The response should be friendly and direct.",
            },
          },
        },
      ],
    })
    saveRun.mockImplementation(async (run: Record<string, unknown>) => ({
      ...run,
      _id: "run-doc",
    }))
    createSessionLogIndexer.mockImplementation(makeIndexer)
  })

  it("passes a case when deterministic and judge checks both pass", async () => {
    mockAgentRun("Hello there")
    mockJudgeRun({
      passed: true,
      reason: "The response is friendly and direct.",
    })

    const run = await runSuite({
      agentId: "agent-1",
      user,
    })

    expect(run.results[0]).toMatchObject({
      status: "passed",
      caseSnapshot: {
        id: "case-1",
        name: "Friendly greeting",
        prompt: "Say hello",
        assertions: {
          contains: ["hello"],
          judge: {
            rubric: "The response should be friendly and direct.",
          },
        },
      },
      failures: [],
      judge: {
        status: "passed",
        reason: "The response is friendly and direct.",
      },
    })
    expect(run.snapshot.aiConfig).toEqual({
      aiConfigId: "config-1",
      name: "Primary config",
      provider: "openai",
      model: "gpt-5",
      liteLLMModelId: "openai/gpt-5",
      reasoningEffort: "medium",
    })
    expect(run.results[0].requestIds).toEqual(
      expect.arrayContaining(["agent-request", "judge-request"])
    )
  })

  it("fails a case when the judge returns a failed verdict", async () => {
    mockAgentRun("Hello there")
    mockJudgeRun({
      passed: false,
      reason: "The response is friendly, but it is too vague.",
    })

    const run = await runSuite({
      agentId: "agent-1",
      user,
    })

    expect(run.results[0]).toMatchObject({
      status: "failed",
      judge: {
        status: "failed",
        reason: "The response is friendly, but it is too vague.",
      },
    })
    expect(run.results[0].failures).toContainEqual({
      type: "judge",
      message: "The response is friendly, but it is too vague.",
    })
  })

  it("marks the case as error when the judge call fails after a response is generated", async () => {
    mockAgentRun("Hello there")
    mockJudgeRun(new Error("structured output failed"))

    const run = await runSuite({
      agentId: "agent-1",
      user,
    })

    expect(run.results[0]).toMatchObject({
      response: "Hello there",
      status: "error",
      judge: {
        status: "error",
        error: "structured output failed",
      },
      error: "Judge failed: structured output failed",
    })
  })
})
