import type { AgentLogRequestDetail } from "@budibase/types"
import { formatLogDateForApi, formatMessages } from "./utils"

describe("formatLogDateForApi", () => {
  const date = new Date("2026-03-06T10:15:30.000Z")

  it("keeps the full timestamp for sub-day filters", () => {
    expect(formatLogDateForApi(date, { includeTime: true })).toBe(
      "2026-03-06T10:15:30.000Z"
    )
  })

  it("uses date-only values for day-based filters", () => {
    expect(formatLogDateForApi(date)).toBe("2026-03-06")
  })
})

describe("formatMessages", () => {
  function buildDetail(messages: AgentLogRequestDetail["messages"]) {
    return {
      requestId: "req-1",
      model: "test-model",
      messages,
      response: "",
      inputToolCalls: [],
      toolCalls: [],
      toolResults: [],
      inputTokens: 0,
      outputTokens: 0,
      startTime: "",
      endTime: "",
    } satisfies AgentLogRequestDetail
  }

  it("returns the latest user message for a step", () => {
    const detail = buildDetail([
      { role: "user", content: "hey there" },
      { role: "assistant", content: "Hello! How can I help?" },
      {
        role: "user",
        content: "hows it going there, what can you do",
      },
    ])

    expect(formatMessages(detail)).toBe("hows it going there, what can you do")
  })

  it("strips prefixed user labels from the latest message", () => {
    const detail = buildDetail([
      { role: "user", content: "first message" },
      { role: "user", content: "user: second message" },
    ])

    expect(formatMessages(detail)).toBe("second message")
  })

  it("falls back when no user message exists", () => {
    const detail = buildDetail([{ role: "assistant", content: "hello" }])

    expect(formatMessages(detail)).toBe("No user prompt")
  })
})
