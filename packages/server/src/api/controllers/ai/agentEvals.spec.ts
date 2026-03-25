import { FetchAgentEvalSuiteResponse, UserCtx } from "@budibase/types"
import {
  fetchAgentEvalSuite,
  runAgentEvalSuite,
  updateAgentEvalSuite,
} from "./agentEvals"

jest.mock("../../../sdk", () => ({
  __esModule: true,
  default: {
    ai: {
      agents: {
        getOrThrow: jest.fn(),
      },
      evals: {
        fetchSuite: jest.fn(),
        fetchLatestRun: jest.fn(),
        saveSuite: jest.fn(),
        runSuite: jest.fn(),
      },
    },
  },
}))

describe("agent eval controllers", () => {
  const sdk = jest.requireMock("../../../sdk").default

  beforeEach(() => {
    jest.clearAllMocks()
    sdk.ai.agents.getOrThrow.mockResolvedValue({ _id: "agent-1" })
  })

  it("fetches suite and latest run", async () => {
    sdk.ai.evals.fetchSuite.mockResolvedValue({ agentId: "agent-1", cases: [] })
    sdk.ai.evals.fetchLatestRun.mockResolvedValue(null)

    const ctx: Partial<UserCtx<void, FetchAgentEvalSuiteResponse, any>> = {
      params: { agentId: "agent-1" },
    }

    await fetchAgentEvalSuite(
      ctx as UserCtx<void, FetchAgentEvalSuiteResponse, any>
    )

    expect(ctx.body).toEqual({
      suite: { agentId: "agent-1", cases: [] },
      latestRun: null,
    })
  })

  it("saves a suite for the requested agent", async () => {
    sdk.ai.evals.saveSuite.mockResolvedValue({
      agentId: "agent-1",
      cases: [
        {
          id: "case-1",
          name: "Case 1",
          prompt: "Who?",
          assertions: { contains: ["Alice"] },
        },
      ],
    })

    const ctx: any = {
      params: { agentId: "agent-1" },
      request: {
        body: {
          cases: [
            {
              id: "case-1",
              name: "Case 1",
              prompt: "Who?",
              assertions: { contains: ["Alice"] },
            },
          ],
        },
      },
      user: {
        _id: "us_1",
      },
    }

    await updateAgentEvalSuite(ctx)

    expect(sdk.ai.evals.saveSuite).toHaveBeenCalledWith({
      agentId: "agent-1",
      request: ctx.request.body,
      updatedBy: expect.any(String),
    })
    expect(ctx.body.agentId).toBe("agent-1")
  })

  it("runs the suite for the requested agent", async () => {
    sdk.ai.evals.runSuite.mockResolvedValue({
      agentId: "agent-1",
      runId: "run-1",
      total: 1,
      passed: 1,
      failed: 0,
      startedAt: "2025-01-01T00:00:00.000Z",
      completedAt: "2025-01-01T00:00:01.000Z",
      results: [],
    })

    const ctx: any = {
      params: { agentId: "agent-1" },
      user: { _id: "us_1" },
    }

    await runAgentEvalSuite(ctx)

    expect(ctx.body).toEqual({
      run: expect.objectContaining({
        agentId: "agent-1",
        runId: "run-1",
      }),
    })
  })
})
