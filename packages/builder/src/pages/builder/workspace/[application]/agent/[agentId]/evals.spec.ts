import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import EvalsPage from "./evals.svelte"

const {
  agentsStore,
  selectedAgent,
  fetchAgentEvalSuite,
  updateAgentEvalSuite,
  runAgentEvalSuite,
  featureFlags,
} = vi.hoisted(() => ({
  agentsStore: {
    subscribe: (
      run: (
        value: {
          tools: { name: string; readableName?: string }[]
        }
      ) => void
    ) => {
      run({
        tools: [
          {
            name: "search_rows",
            readableName: "Search rows",
          },
        ],
      })
      return () => {}
    },
  },
  selectedAgent: {
    subscribe: (
      run: (
        value: { _id: string; name: string; enabledTools?: string[] }
      ) => void
    ) => {
      run({
        _id: "agent-1",
        name: "Support Agent",
        enabledTools: ["search_rows"],
      })
      return () => {}
    },
  },
  featureFlags: {
    subscribe: (run: (value: { AI_EVALS: boolean }) => void) => {
      run({ AI_EVALS: true })
      return () => {}
    },
  },
  fetchAgentEvalSuite: vi.fn(),
  updateAgentEvalSuite: vi.fn(),
  runAgentEvalSuite: vi.fn(),
}))

vi.mock("@/stores/portal", () => ({
  agentsStore,
  featureFlags,
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
            input: "Who is the engineering manager?",
            context: "Use the latest org chart.",
            reviewers: [
              {
                id: "reviewer-1",
                type: "contains_text",
                text: "Bob",
              },
            ],
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
          aiConfig: {
            aiConfigId: "config-1",
            provider: "openai",
            model: "gpt-5",
          },
          enabledTools: ["search_rows"],
          knowledgeBases: [],
        },
        results: [
          {
            caseId: "case-1",
            name: "Employee lookup",
            input: "Who is the product manager?",
            context: "Use the org chart from Q4.",
            caseSnapshot: {
              id: "case-1",
              name: "Employee lookup",
              input: "Who is the product manager?",
              context: "Use the org chart from Q4.",
              reviewers: [
                {
                  id: "reviewer-1",
                  type: "contains_text",
                  text: "Alice",
                },
                {
                  id: "reviewer-2",
                  type: "llm_judge",
                  rubric: "The answer should identify the correct person.",
                },
              ],
            },
            response: "Alice is the product manager.",
            status: "passed",
            reviewerResults: [
              {
                reviewerId: "reviewer-1",
                type: "contains_text",
                status: "passed",
                message: 'Found "Alice" in the final response.',
              },
              {
                reviewerId: "reviewer-2",
                type: "llm_judge",
                status: "passed",
                message: "The answer identifies the correct person.",
              },
            ],
            toolCalls: ["search_rows"],
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

  it("renders stored reviewer verdicts, tools, and snapshot values from the selected run", async () => {
    render(EvalsPage)

    await waitFor(() => {
      expect(fetchAgentEvalSuite).toHaveBeenCalledWith("agent-1")
    })

    expect(await screen.findAllByText("Employee lookup")).toHaveLength(2)

    await fireEvent.click(screen.getByText("Runs"))

    expect(await screen.findByText("Suite runs")).toBeInTheDocument()
    expect(screen.getByText("Cases in run")).toBeInTheDocument()
    expect(screen.getByText("openai / gpt-5")).toBeInTheDocument()
    expect(screen.getByText("search_rows")).toBeInTheDocument()

    await fireEvent.click(screen.getByText("Results"))

    expect(screen.getByText("Reviewer verdicts")).toBeInTheDocument()
    expect(
      screen.getByText("The answer identifies the correct person.")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Alice is the product manager.")
    ).toBeInTheDocument()
    expect(screen.getAllByText("Who is the product manager?").length).toBeGreaterThan(0)
    expect(screen.getByText("Use the org chart from Q4.")).toBeInTheDocument()
    expect(screen.getAllByText("Alice").length).toBeGreaterThan(0)
  })

  it("lets the user add each reviewer type from the chooser", async () => {
    fetchAgentEvalSuite.mockResolvedValueOnce({
      suite: {
        agentId: "agent-1",
        cases: [
          {
            id: "case-1",
            name: "Blank case",
            input: "",
            reviewers: [],
          },
        ],
      },
      latestRun: null,
      recentRuns: [],
    })

    render(EvalsPage)

    await waitFor(() => {
      expect(fetchAgentEvalSuite).toHaveBeenCalledWith("agent-1")
    })

    await fireEvent.click(screen.getByText("Add reviewer"))
    await fireEvent.click(screen.getByText("Exact match"))
    expect(screen.getByText("Expected final response")).toBeInTheDocument()

    await fireEvent.click(screen.getByText("Add reviewer"))
    await fireEvent.click(screen.getByText("Contains text"))
    expect(screen.getByText("Text to find")).toBeInTheDocument()

    await fireEvent.click(screen.getByText("Add reviewer"))
    await fireEvent.click(screen.getByText("LLM judge"))
    expect(screen.getByText("Rubric")).toBeInTheDocument()

    await fireEvent.click(screen.getByText("Add reviewer"))
    await fireEvent.click(screen.getByText("Tool used"))
    expect(screen.getByText("Tool name")).toBeInTheDocument()

    const removeButtons = screen.getAllByText("Remove")
    await fireEvent.click(removeButtons[0])
    expect(screen.queryByText("Expected final response")).not.toBeInTheDocument()
  })
})
