import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/svelte"
import EvalsPage from "./evals.svelte"

const {
  selectedAgent,
  fetchAgentEvalSuite,
  updateAgentEvalSuite,
  runAgentEvalSuite,
} = vi.hoisted(() => ({
  selectedAgent: {
    subscribe: (run: (value: { _id: string; name: string }) => void) => {
      run({
        _id: "agent-1",
        name: "Support Agent",
      })
      return () => {}
    },
  },
  fetchAgentEvalSuite: vi.fn(),
  updateAgentEvalSuite: vi.fn(),
  runAgentEvalSuite: vi.fn(),
}))

vi.mock("@/stores/portal", () => ({
  selectedAgent,
}))

vi.mock("@/api", () => ({
  API: {
    fetchAgentEvalSuite,
    updateAgentEvalSuite,
    runAgentEvalSuite,
  },
}))

describe("agent evals page", () => {
  beforeEach(() => {
    fetchAgentEvalSuite.mockResolvedValue({
      suite: {
        agentId: "agent-1",
        cases: [
          {
            id: "case-1",
            name: "Employee lookup",
            prompt: "Who is the product manager?",
            assertions: {
              contains: ["Alice"],
            },
          },
        ],
      },
      latestRun: {
        agentId: "agent-1",
        runId: "run-1",
        total: 1,
        passed: 1,
        failed: 0,
        startedAt: "2025-01-01T00:00:00.000Z",
        completedAt: "2025-01-01T00:00:01.000Z",
        results: [
          {
            caseId: "case-1",
            name: "Employee lookup",
            prompt: "Who is the product manager?",
            response: "Alice is the product manager.",
            status: "passed",
            failures: [],
            sessionId: "eval:run-1:case-1",
            requestIds: [],
            startedAt: "2025-01-01T00:00:00.000Z",
            completedAt: "2025-01-01T00:00:01.000Z",
            durationMs: 1000,
          },
        ],
      },
    })
    updateAgentEvalSuite.mockResolvedValue({
      agentId: "agent-1",
      cases: [],
    })
    runAgentEvalSuite.mockResolvedValue({
      run: {
        agentId: "agent-1",
        runId: "run-2",
        total: 0,
        passed: 0,
        failed: 0,
        startedAt: "2025-01-01T00:00:00.000Z",
        completedAt: "2025-01-01T00:00:01.000Z",
        results: [],
      },
    })
  })

  it("loads and renders the latest suite and result", async () => {
    render(EvalsPage)

    await waitFor(() => {
      expect(fetchAgentEvalSuite).toHaveBeenCalledWith("agent-1")
    })

    expect(await screen.findByText("Employee lookup")).toBeInTheDocument()
    expect(screen.getAllByText("Passed")).toHaveLength(2)
    expect(
      screen.getByText("Alice is the product manager.")
    ).toBeInTheDocument()
  })
})
