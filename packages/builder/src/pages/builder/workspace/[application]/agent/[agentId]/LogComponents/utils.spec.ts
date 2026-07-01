import { vi } from "vitest"
import dayjs from "dayjs"

vi.mock("@budibase/frontend-core", () => ({
  formatToolName: (name: string, displayName?: string) => ({
    full: displayName || name,
  }),
}))

import type {
  AgentLogEntry,
  AgentLogRequestDetail,
  AgentLogRequestError,
  AgentLogSession,
} from "@budibase/types"
import {
  formatLogDateForApi,
  formatTime,
  formatSpend,
  formatDuration,
  getDuration,
  getStepDuration,
  isSlowStep,
  getSessionSummary,
  getStepFlow,
  formatMessages,
  parseAssistantResponse,
  formatErrorDetail,
  formatStructuredContent,
} from "./utils"

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

function makeSession(
  overrides: Partial<AgentLogSession> & { entries?: AgentLogEntry[] } = {}
): AgentLogSession {
  return {
    sessionId: "sess-1",
    environment: "development",
    firstInput: "Hello",
    trigger: "manual",
    isPreview: false,
    startTime: "2025-01-15T10:00:00.000Z",
    operations: 2,
    status: "success",
    entries: [makeEntry()],
    ...overrides,
  }
}

function makeDetail(
  overrides: Partial<AgentLogRequestDetail> = {}
): AgentLogRequestDetail {
  return {
    requestId: "req-1",
    model: "gpt-4o",
    messages: [],
    response: "",
    toolCalls: [],
    toolResults: [],
    inputToolCalls: [],
    inputTokens: 100,
    outputTokens: 50,
    spend: 0.005,
    startTime: "2025-01-15T10:00:00.000Z",
    endTime: "2025-01-15T10:00:01.000Z",
    ...overrides,
  }
}

describe("formatLogDateForApi", () => {
  it("returns date only by default", () => {
    const date = new Date("2025-06-15T14:30:00.000Z")
    expect(formatLogDateForApi(date)).toBe("2025-06-15")
  })

  it("preserves the selected local day for dayjs inputs", () => {
    expect(formatLogDateForApi(dayjs("2025-06-15T23:30:00"))).toBe("2025-06-15")
  })

  it("returns full ISO string when includeTime is true", () => {
    const date = new Date("2025-06-15T14:30:00.000Z")
    expect(formatLogDateForApi(date, { includeTime: true })).toBe(
      "2025-06-15T14:30:00.000Z"
    )
  })
})

describe("formatTime", () => {
  it("returns dash for empty string", () => {
    expect(formatTime("")).toBe("-")
  })

  it("formats a date string", () => {
    const result = formatTime("2025-01-15T10:30:00.000Z")
    expect(result).toMatch(/Jan 15, 2025/)
    expect(result).toContain("|")
  })
})

describe("formatSpend", () => {
  it("returns $0.0000 for zero", () => {
    expect(formatSpend(0)).toBe("$0.0000")
  })

  it("formats to 4 decimal places", () => {
    expect(formatSpend(0.12345)).toBe("$0.1235")
  })

  it("formats whole numbers", () => {
    expect(formatSpend(1)).toBe("$1.0000")
  })
})

describe("formatDuration", () => {
  it("returns milliseconds for values under 1000", () => {
    expect(formatDuration(500)).toBe("500ms")
    expect(formatDuration(0)).toBe("0ms")
    expect(formatDuration(999)).toBe("999ms")
  })

  it("returns seconds for values >= 1000", () => {
    expect(formatDuration(1000)).toBe("1.0s")
    expect(formatDuration(1500)).toBe("1.5s")
    expect(formatDuration(10000)).toBe("10.0s")
  })

  it("respects custom decimal places", () => {
    expect(formatDuration(1234, 2)).toBe("1.23s")
    expect(formatDuration(1234, 0)).toBe("1s")
  })
})

describe("getDuration", () => {
  it("returns empty string when startTime is missing", () => {
    expect(getDuration(undefined, "2025-01-15T10:00:01.000Z")).toBe("")
  })

  it("returns empty string when endTime is missing", () => {
    expect(getDuration("2025-01-15T10:00:00.000Z", undefined)).toBe("")
  })

  it("calculates duration between two times", () => {
    expect(
      getDuration("2025-01-15T10:00:00.000Z", "2025-01-15T10:00:01.500Z")
    ).toBe("1.5s")
  })

  it("passes decimals through", () => {
    expect(
      getDuration("2025-01-15T10:00:00.000Z", "2025-01-15T10:00:01.234Z", 3)
    ).toBe("1.234s")
  })
})

describe("getStepDuration", () => {
  it("returns formatted duration from entry times", () => {
    expect(getStepDuration(makeEntry())).toBe("1.5s")
  })

  it("returns empty string when times are missing", () => {
    expect(
      getStepDuration(
        makeEntry({ startTime: undefined as any, endTime: undefined as any })
      )
    ).toBe("")
  })
})

describe("isSlowStep", () => {
  it("returns true for steps over 2 seconds", () => {
    expect(
      isSlowStep(
        makeEntry({
          startTime: "2025-01-15T10:00:00.000Z",
          endTime: "2025-01-15T10:00:02.001Z",
        })
      )
    ).toBe(true)
  })

  it("returns false for steps at exactly 2 seconds", () => {
    expect(
      isSlowStep(
        makeEntry({
          startTime: "2025-01-15T10:00:00.000Z",
          endTime: "2025-01-15T10:00:02.000Z",
        })
      )
    ).toBe(false)
  })

  it("returns false for fast steps", () => {
    expect(
      isSlowStep(
        makeEntry({
          startTime: "2025-01-15T10:00:00.000Z",
          endTime: "2025-01-15T10:00:00.500Z",
        })
      )
    ).toBe(false)
  })
})

describe("getSessionSummary", () => {
  it("sums tokens and spend across entries", () => {
    const session = makeSession({
      entries: [
        makeEntry({ inputTokens: 100, outputTokens: 50, spend: 0.01 }),
        makeEntry({ inputTokens: 200, outputTokens: 75, spend: 0.02 }),
      ],
    })
    const summary = getSessionSummary(session)
    expect(summary.inputTokens).toBe(300)
    expect(summary.outputTokens).toBe(125)
    expect(summary.spend).toBeCloseTo(0.03)
  })

  it("calculates latency from session start to last entry end", () => {
    const session = makeSession({
      startTime: "2025-01-15T10:00:00.000Z",
      entries: [makeEntry({ endTime: "2025-01-15T10:00:03.500Z" })],
    })
    expect(getSessionSummary(session).latency).toBe("3.50s")
  })

  it("returns dash for latency when entries are empty", () => {
    const session = makeSession({ entries: [] })
    expect(getSessionSummary(session).latency).toBe("-")
  })
})

describe("getStepFlow", () => {
  it("returns loading state", () => {
    expect(getStepFlow(undefined, true)).toEqual({
      from: "Loading details",
      to: "...",
    })
  })

  it("returns default flow when detail is undefined", () => {
    expect(getStepFlow(undefined, false)).toEqual({
      from: "Model input",
      to: "Model output",
    })
  })

  it("uses tool result names for from and tool call names for to", () => {
    const detail = makeDetail({
      toolResults: [{ name: "search", content: "" }],
      toolCalls: [{ name: "update_row", arguments: "{}" }],
    })
    const flow = getStepFlow(detail, false)
    expect(flow.from).toBe("search")
    expect(flow.to).toBe("update_row")
  })

  it("uses displayName when available", () => {
    const detail = makeDetail({
      toolResults: [
        { name: "search", displayName: "Search Tool", content: "" },
      ],
      toolCalls: [],
      response: "done",
    })
    const flow = getStepFlow(detail, false)
    expect(flow.from).toBe("Search Tool")
    expect(flow.to).toBe("Assistant response")
  })

  it("falls back to Prompt + context when no tool results", () => {
    const detail = makeDetail({ toolResults: [], toolCalls: [] })
    expect(getStepFlow(detail, false).from).toBe("Prompt + context")
  })

  it("shows Error when detail has an error and no tool calls", () => {
    const detail = makeDetail({
      toolCalls: [],
      error: { message: "fail" },
    })
    expect(getStepFlow(detail, false).to).toBe("Error")
  })

  it("shows No response when no tool calls, no error, no response", () => {
    const detail = makeDetail({
      toolCalls: [],
      response: "",
    })
    expect(getStepFlow(detail, false).to).toBe("No response")
  })

  it("groups duplicate tool names with count", () => {
    const detail = makeDetail({
      toolResults: [],
      toolCalls: [
        { name: "search", arguments: "{}" },
        { name: "search", arguments: "{}" },
        { name: "update_row", arguments: "{}" },
      ],
    })
    expect(getStepFlow(detail, false).to).toBe("search (x2), update_row")
  })
})

describe("formatMessages", () => {
  it("returns the last user message content", () => {
    const detail = makeDetail({
      messages: [
        { role: "system", content: "You are an assistant" },
        { role: "user", content: "first question" },
        { role: "assistant", content: "response" },
        { role: "user", content: "second question" },
      ],
    })
    expect(formatMessages(detail)).toBe("second question")
  })

  it("returns 'No user prompt' when there are no user messages", () => {
    const detail = makeDetail({
      messages: [{ role: "system", content: "system prompt" }],
    })
    expect(formatMessages(detail)).toBe("No user prompt")
  })

  it("extracts content after 'user:' prefix", () => {
    const detail = makeDetail({
      messages: [{ role: "user", content: "user: what is the weather?" }],
    })
    expect(formatMessages(detail)).toBe("what is the weather?")
  })

  it("handles case-insensitive role matching", () => {
    const detail = makeDetail({
      messages: [{ role: "User", content: "hello" }],
    })
    expect(formatMessages(detail)).toBe("hello")
  })
})

describe("parseAssistantResponse", () => {
  it("returns empty strings for empty content", () => {
    expect(parseAssistantResponse("")).toEqual({
      thinking: "",
      response: "",
    })
  })

  it("returns content as response when no think tags", () => {
    expect(parseAssistantResponse("Hello world")).toEqual({
      thinking: "",
      response: "Hello world",
    })
  })

  it("extracts thinking and response from think tags", () => {
    const content = "<think>reasoning here</think>Final answer"
    const result = parseAssistantResponse(content)
    expect(result.thinking).toBe("reasoning here")
    expect(result.response).toBe("Final answer")
  })

  it("handles multiple think blocks", () => {
    const content =
      "<think>first thought</think>middle<think>second thought</think>end"
    const result = parseAssistantResponse(content)
    expect(result.thinking).toBe("first thought\n\nsecond thought")
    expect(result.response).toBe("middleend")
  })

  it("handles unclosed think tag as streaming thinking", () => {
    const content = "<think>still thinking about this"
    const result = parseAssistantResponse(content)
    expect(result.thinking).toBe("still thinking about this")
    expect(result.response).toBe("")
  })
})

describe("formatErrorDetail", () => {
  it("formats message only", () => {
    const error: AgentLogRequestError = { message: "Something went wrong" }
    expect(formatErrorDetail(error)).toBe("Something went wrong")
  })

  it("includes all optional fields", () => {
    const error: AgentLogRequestError = {
      message: "Rate limited",
      errorClass: "RateLimitError",
      code: "429",
      provider: "openai",
      traceback: "at line 1\nat line 2",
    }
    const result = formatErrorDetail(error)
    expect(result).toContain("Rate limited")
    expect(result).toContain("Class: RateLimitError")
    expect(result).toContain("Code: 429")
    expect(result).toContain("Provider: openai")
    expect(result).toContain("at line 1\nat line 2")
  })

  it("separates traceback with blank line", () => {
    const error: AgentLogRequestError = {
      message: "fail",
      traceback: "stack trace",
    }
    const lines = formatErrorDetail(error).split("\n")
    expect(lines).toEqual(["fail", "", "stack trace"])
  })
})

describe("formatStructuredContent", () => {
  it("returns 'No data captured' for empty content", () => {
    expect(formatStructuredContent("")).toBe("No data captured")
    expect(formatStructuredContent("   ")).toBe("No data captured")
  })

  it("pretty-prints valid JSON objects", () => {
    expect(formatStructuredContent('{"a":1}')).toBe(
      JSON.stringify({ a: 1 }, null, 2)
    )
  })

  it("pretty-prints valid JSON arrays", () => {
    expect(formatStructuredContent("[1,2,3]")).toBe(
      JSON.stringify([1, 2, 3], null, 2)
    )
  })

  it("returns raw content for non-JSON", () => {
    expect(formatStructuredContent("just text")).toBe("just text")
  })

  it("returns raw content for invalid JSON starting with [ or {", () => {
    expect(formatStructuredContent("{not json}")).toBe("{not json}")
  })
})
