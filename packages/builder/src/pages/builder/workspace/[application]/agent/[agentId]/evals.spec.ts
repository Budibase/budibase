import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/svelte"
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

describe("agent evaluations page", () => {
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
              judge: {
                rubric: "The answer should identify the correct person.",
              },
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
        snapshot: {
          agentId: "agent-1",
          agentName: "Support Agent",
          aiconfig: "config-1",
          enabledTools: [],
          knowledgeBases: [],
        },
        results: [
          {
            caseId: "case-1",
            name: "Employee lookup",
            prompt: "Who is the product manager?",
            caseSnapshot: {
              id: "case-1",
              name: "Employee lookup",
              prompt: "Who is the product manager?",
              assertions: {
                contains: ["Alice"],
                judge: {
                  rubric: "The answer should identify the correct person.",
                },
              },
            },
            response: "Alice is the product manager.",
            status: "passed",
            failures: [],
            judge: {
              status: "passed",
              reason: "The response identifies the correct person.",
            },
            sessionId: "eval:run-1:case-1",
            requestIds: [],
            startedAt: "2025-01-01T00:00:00.000Z",
            completedAt: "2025-01-01T00:00:01.000Z",
            durationMs: 1000,
          },
        ],
      },
      recentRuns: [],
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
        snapshot: {
          agentId: "agent-1",
          agentName: "Support Agent",
          aiconfig: "config-1",
          aiConfig: {
            aiConfigId: "config-1",
            provider: "openai",
            model: "gpt-5",
          },
          enabledTools: [],
          knowledgeBases: [],
        },
        results: [],
      },
    })
  })

  it("loads and renders the latest suite and result", async () => {
    render(EvalsPage)

    await waitFor(() => {
      expect(fetchAgentEvalSuite).toHaveBeenCalledWith("agent-1")
    })

    // Case name appears in list and detail header (Overview tab is default)
    expect(await screen.findAllByText("Employee lookup")).toHaveLength(2)
    expect(screen.getAllByText("Passed").length).toBeGreaterThanOrEqual(1)

    // Switch to Configuration tab to check form fields
    await fireEvent.click(screen.getByText("Configuration"))
    expect(
      screen.getByDisplayValue("The answer should identify the correct person.")
    ).toBeInTheDocument()

    // Switch to Results tab to check result details
    await fireEvent.click(screen.getByText("Results"))
    expect(
      screen.getByText("The response identifies the correct person.")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Alice is the product manager.")
    ).toBeInTheDocument()
  })
})
