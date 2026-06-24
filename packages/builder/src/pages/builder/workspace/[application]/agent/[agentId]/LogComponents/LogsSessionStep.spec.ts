import { render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import type { AgentLogEntry } from "@budibase/types"
import LogsSessionStep from "./LogsSessionStep.svelte"

vi.mock("@budibase/frontend-core", () => ({
  formatToolName: (name: string, displayName?: string) => ({
    full: displayName || name,
  }),
}))

function makeEntry(overrides: Partial<AgentLogEntry> = {}): AgentLogEntry {
  return {
    requestId: "req-1",
    sessionId: "sess-1",
    model: "gpt-4o",
    inputTokens: 100,
    outputTokens: 50,
    spend: 0.005,
    startTime: "2025-01-15T10:00:00.000Z",
    endTime: "2025-01-15T10:00:01.500Z",
    status: "success",
    ...overrides,
  }
}

describe("LogsSessionStep", () => {
  it("renders loading panels while expanded step detail is loading", () => {
    const { container } = render(LogsSessionStep, {
      entry: makeEntry(),
      index: 0,
      expanded: true,
      loadingStep: true,
      onToggleStep: vi.fn(),
    })

    expect(screen.getByText("Input")).toBeInTheDocument()
    expect(screen.getByText("Output")).toBeInTheDocument()
    expect(container.querySelectorAll('[aria-busy="true"]')).toHaveLength(2)
    expect(screen.queryByText("Prompt")).not.toBeInTheDocument()
  })
})
