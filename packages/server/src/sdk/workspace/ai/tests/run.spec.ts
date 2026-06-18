import type { ContextUser } from "@budibase/types"
import { runSuite } from "./run"

jest.mock("@budibase/backend-core", () => ({
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
  getLiveOperation: (agent: {
    operations?: Array<{ live?: boolean } & Record<string, unknown>>
  }) => {
    const operation = agent.operations?.[0]
    return operation?.live === true ? operation : undefined
  },
  prepareAgentChatRun: jest.fn(),
}))

jest.mock("./crud", () => ({
  fetchSuite: jest.fn(),
  persistRunResults: jest.fn().mockResolvedValue(undefined),
}))

jest.mock("ai", () => ({
  Output: {
    object: jest.fn().mockReturnValue({}),
  },
  ToolLoopAgent: jest.fn(),
  extractReasoningMiddleware: jest.fn().mockReturnValue({}),
  jsonSchema: jest.fn((schema: unknown) => schema),
  stepCountIs: jest.fn().mockReturnValue(() => false),
  tool: jest.fn(definition => definition),
  wrapLanguageModel: jest.fn().mockReturnValue({}),
}))

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("run-1"),
}))

describe("agent test runner", () => {
  const sdk = jest.requireMock("../../..").default
  const ai = jest.requireMock("ai")
  const { prepareAgentChatRun } = jest.requireMock("../agents")
  const { fetchSuite } = jest.requireMock("./crud")
  const user = {} as ContextUser

  const makeIndexer = () => {
    const ids = new Set<string>()
    return {
      addRequestId: jest.fn((id?: string | null) => {
        if (id) ids.add(id)
      }),
      index: jest.fn().mockResolvedValue(undefined),
      getRequestIds: jest.fn(() => [...ids]),
    }
  }

  const setSuite = (reviewers: unknown[]) => {
    fetchSuite.mockResolvedValue({
      agentId: "agent-1",
      groups: [
        {
          id: "default",
          name: "Default test group",
        },
      ],
      cases: [
        {
          id: "case-1",
          groupId: "default",
          name: "Friendly greeting",
          input: "Say hello",
          context: "Keep it brief",
          reviewers,
        },
      ],
    })
  }

  const mockAgentRun = ({
    response,
    toolCalls = [],
  }: {
    response: string
    toolCalls?: string[]
  }) => {
    prepareAgentChatRun.mockImplementation(async () => {
      const sessionLogIndexer = makeIndexer()
      return {
        sessionLogIndexer,
        stream: jest.fn().mockImplementation(async ({ onToolCalls }) => {
          sessionLogIndexer.addRequestId("agent-request")
          onToolCalls?.(toolCalls)
          return {
            text: Promise.resolve(response),
            response: Promise.resolve({
              id: "agent-request",
            }),
          }
        }),
      }
    })
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
      operations: [
        {
          id: "operation_1",
          name: "Main operation",
          live: false,
          enabledTools: [],
          knowledgeBases: [],
        },
      ],
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
  })

  it("passes exact and contains reviewers when the response matches", async () => {
    setSuite([
      {
        id: "reviewer-1",
        type: "exact_match",
        value: "Hello there",
      },
      {
        id: "reviewer-2",
        type: "contains_text",
        value: "Hello",
      },
    ])
    mockAgentRun({ response: "Hello there" })

    const run = await runSuite({
      agentId: "agent-1",
      user,
    })

    expect(run.results[0]).toMatchObject({
      status: "passed",
      reviewerResults: [
        {
          reviewerId: "reviewer-1",
          type: "exact_match",
          status: "passed",
        },
        {
          reviewerId: "reviewer-2",
          type: "contains_text",
          status: "passed",
        },
      ],
      caseSnapshot: {
        id: "case-1",
        name: "Friendly greeting",
        input: "Say hello",
        context: "Keep it brief",
        reviewers: [
          {
            id: "reviewer-1",
            type: "exact_match",
            value: "Hello there",
          },
          {
            id: "reviewer-2",
            type: "contains_text",
            value: "Hello",
          },
        ],
      },
      toolCalls: [],
    })
  })

  it("fails an exact match reviewer when the final response differs", async () => {
    setSuite([
      {
        id: "reviewer-1",
        type: "exact_match",
        value: "Hello there",
      },
    ])
    mockAgentRun({ response: "Hello team" })

    const run = await runSuite({
      agentId: "agent-1",
      user,
    })

    expect(run.results[0]).toMatchObject({
      status: "failed",
      reviewerResults: [
        {
          reviewerId: "reviewer-1",
          type: "exact_match",
          status: "failed",
          message:
            'Expected the final response to exactly match "Hello there".',
        },
      ],
    })
  })

  it("fails a contains reviewer when the expected text is missing", async () => {
    setSuite([
      {
        id: "reviewer-1",
        type: "contains_text",
        value: "Alice",
      },
    ])
    mockAgentRun({ response: "Bob is the manager." })

    const run = await runSuite({
      agentId: "agent-1",
      user,
    })

    expect(run.results[0]).toMatchObject({
      status: "failed",
      reviewerResults: [
        {
          reviewerId: "reviewer-1",
          type: "contains_text",
          status: "failed",
          message: 'Expected the final response to include "Alice".',
        },
      ],
    })
  })

  it("passes a tool used reviewer when the expected tool was called", async () => {
    setSuite([
      {
        id: "reviewer-1",
        type: "tool_used",
        value: "search_rows",
      },
    ])
    mockAgentRun({
      response: "Found a result.",
      toolCalls: ["search_rows", "get_row"],
    })

    const run = await runSuite({
      agentId: "agent-1",
      user,
    })

    expect(run.results[0]).toMatchObject({
      status: "passed",
      toolCalls: ["search_rows", "get_row"],
      reviewerResults: [
        {
          reviewerId: "reviewer-1",
          type: "tool_used",
          status: "passed",
        },
      ],
    })
  })

  it("fails a tool used reviewer when the expected tool was not called", async () => {
    setSuite([
      {
        id: "reviewer-1",
        type: "tool_used",
        value: "search_rows",
      },
    ])
    mockAgentRun({
      response: "Handled without a tool.",
      toolCalls: ["list_tables"],
    })

    const run = await runSuite({
      agentId: "agent-1",
      user,
    })

    expect(run.results[0]).toMatchObject({
      status: "failed",
      toolCalls: ["list_tables"],
      reviewerResults: [
        {
          reviewerId: "reviewer-1",
          type: "tool_used",
          status: "failed",
          message: 'Expected tool "search_rows" to be used.',
        },
      ],
    })
  })

  it("persists mixed reviewer results and marks the case failed when any reviewer fails", async () => {
    setSuite([
      {
        id: "reviewer-1",
        type: "contains_text",
        value: "Hello",
      },
      {
        id: "reviewer-2",
        type: "llm_judge",
        value: "The response should be direct.",
      },
      {
        id: "reviewer-3",
        type: "tool_used",
        value: "search_rows",
      },
    ])
    mockAgentRun({
      response: "Hello there",
      toolCalls: ["get_row"],
    })
    mockJudgeRun({
      passed: true,
      reason: "The response is direct.",
    })

    const run = await runSuite({
      agentId: "agent-1",
      user,
    })

    expect(run.results[0]).toMatchObject({
      status: "failed",
      toolCalls: ["get_row"],
      reviewerResults: [
        {
          reviewerId: "reviewer-1",
          type: "contains_text",
          status: "passed",
          message: 'Found "Hello" in the final response.',
        },
        {
          reviewerId: "reviewer-2",
          type: "llm_judge",
          status: "passed",
          message: "The response is direct.",
        },
        {
          reviewerId: "reviewer-3",
          type: "tool_used",
          status: "failed",
          message: 'Expected tool "search_rows" to be used.',
        },
      ],
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

  it("runs the test through the production agent runtime with test messages", async () => {
    setSuite([
      {
        id: "reviewer-1",
        type: "contains_text",
        value: "policy",
      },
    ])
    sdk.ai.agents.getOrThrow.mockResolvedValue({
      _id: "agent-1",
      name: "Support Agent",
      aiconfig: "config-1",
      operations: [
        {
          id: "operation_1",
          name: "Main operation",
          live: false,
          enabledTools: [],
          knowledgeBases: ["kb-1"],
        },
      ],
    })
    mockAgentRun({ response: "The policy is 30 days." })

    await runSuite({
      agentId: "agent-1",
      user,
    })

    expect(prepareAgentChatRun).toHaveBeenCalledWith(
      expect.objectContaining({
        agent: expect.objectContaining({
          _id: "agent-1",
          aiconfig: "config-1",
          operations: [
            expect.objectContaining({
              knowledgeBases: ["kb-1"],
            }),
          ],
        }),
        aiConfigId: "config-1",
        errorLabel: "agent test",
        latestQuestion: "Say hello",
        modelMessages: [
          {
            role: "system",
            content:
              "Additional test context:\nKeep it brief\n\nUse this context when answering the user.",
          },
          {
            role: "user",
            content: "Say hello",
          },
        ],
        sessionId: "test:run-1:case-1:config-1",
        user,
      })
    )
  })

  it("marks the case as error when a judge reviewer errors", async () => {
    setSuite([
      {
        id: "reviewer-1",
        type: "llm_judge",
        value: "The response should be direct.",
      },
    ])
    mockAgentRun({ response: "Hello there" })
    mockJudgeRun(new Error("structured output failed"))

    const run = await runSuite({
      agentId: "agent-1",
      user,
    })

    expect(run.results[0]).toMatchObject({
      response: "Hello there",
      status: "error",
      reviewerResults: [
        {
          reviewerId: "reviewer-1",
          type: "llm_judge",
          status: "error",
          message: "Judge failed: structured output failed",
        },
      ],
      error: "Judge failed: structured output failed",
    })
  })

  it("runs only the requested case when caseId is set", async () => {
    fetchSuite.mockResolvedValue({
      agentId: "agent-1",
      groups: [
        {
          id: "group-a",
          name: "Group A",
        },
        {
          id: "group-b",
          name: "Group B",
        },
      ],
      cases: [
        {
          id: "case-a",
          groupId: "group-a",
          name: "First",
          input: "a",
          reviewers: [],
        },
        {
          id: "case-b",
          groupId: "group-b",
          name: "Second",
          input: "b",
          reviewers: [],
        },
      ],
    })
    mockAgentRun({ response: "ok" })

    const run = await runSuite({
      agentId: "agent-1",
      user,
      caseId: "case-b",
    })

    expect(run.total).toBe(1)
    expect(run.results).toHaveLength(1)
    expect(run.results[0].caseId).toBe("case-b")
  })

  it("runs only the requested group when groupId is set", async () => {
    fetchSuite.mockResolvedValue({
      agentId: "agent-1",
      groups: [
        {
          id: "group-a",
          name: "Group A",
        },
        {
          id: "group-b",
          name: "Group B",
        },
      ],
      cases: [
        {
          id: "case-a",
          groupId: "group-a",
          name: "First",
          input: "a",
          reviewers: [],
        },
        {
          id: "case-b",
          groupId: "group-b",
          name: "Second",
          input: "b",
          reviewers: [],
        },
      ],
    })
    mockAgentRun({ response: "ok" })

    const run = await runSuite({
      agentId: "agent-1",
      user,
      groupId: "group-b",
    })

    expect(run.total).toBe(1)
    expect(run.results).toHaveLength(1)
    expect(run.results[0].caseId).toBe("case-b")
  })

  it("rejects group runs when the selected group is empty", async () => {
    fetchSuite.mockResolvedValue({
      agentId: "agent-1",
      groups: [
        {
          id: "group-a",
          name: "Group A",
        },
        {
          id: "group-b",
          name: "Group B",
        },
      ],
      cases: [
        {
          id: "case-a",
          groupId: "group-a",
          name: "First",
          input: "a",
          reviewers: [],
        },
      ],
    })

    await expect(
      runSuite({
        agentId: "agent-1",
        user,
        groupId: "group-b",
      })
    ).rejects.toThrow("Add at least one test to this group before running it.")
  })

  it("rejects runs that specify both caseId and groupId", async () => {
    fetchSuite.mockResolvedValue({
      agentId: "agent-1",
      groups: [
        {
          id: "group-a",
          name: "Group A",
        },
      ],
      cases: [
        {
          id: "case-a",
          groupId: "group-a",
          name: "First",
          input: "a",
          reviewers: [],
        },
      ],
    })

    await expect(
      runSuite({
        agentId: "agent-1",
        user,
        caseId: "case-a",
        groupId: "group-a",
      })
    ).rejects.toThrow("Select either a single test or a test group to run.")
  })
})
