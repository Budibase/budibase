import type {
  Tool,
  UIMessage,
  ToolSet,
  TypedToolCall,
  TypedToolResult,
} from "ai"
import { ToolType } from "@budibase/types"
import {
  findIncompleteToolCalls,
  getToolDisplayNames,
  updatePendingToolCalls,
} from "./utils"

type MessagePart = NonNullable<UIMessage["parts"]>[number]

const toolPart = (part: Record<string, unknown>): MessagePart =>
  part as MessagePart

describe("getToolDisplayNames", () => {
  it("returns readable names keyed by raw tool name", () => {
    expect(
      getToolDisplayNames([
        {
          name: "ta_123_list_rows",
          readableName: "Research Notes.list_rows",
          description: "List rows",
          sourceType: ToolType.INTERNAL_TABLE,
          tool: {} as Tool,
        },
        {
          name: "list_tables",
          description: "List tables",
          sourceType: ToolType.INTERNAL_TABLE,
          tool: {} as Tool,
        },
      ])
    ).toEqual({
      ta_123_list_rows: "Research Notes.list_rows",
    })
  })
})

describe("incomplete tool call detection", () => {
  describe("findIncompleteToolCalls", () => {
    it("returns only incomplete assistant tool calls", () => {
      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "assistant",
          parts: [
            toolPart({
              type: "tool-list_automations",
              toolName: "list_automations",
              toolCallId: "call-1",
              state: "output-available",
              input: {},
              output: { automations: [] },
            }),
            toolPart({
              type: "tool-get_automation",
              toolName: "get_automation",
              toolCallId: "call-2",
              state: "input-available",
              input: { automationId: "au_123" },
            }),
          ],
        },
        {
          id: "msg-2",
          role: "user",
          parts: [
            toolPart({
              type: "tool-fake",
              toolName: "fake",
              toolCallId: "call-3",
              state: "input-streaming",
              input: undefined,
            }),
          ],
        },
      ]

      const result = findIncompleteToolCalls(messages)
      expect(result).toEqual([
        {
          toolName: "get_automation",
          toolCallId: "call-2",
          state: "input-available",
        },
      ])
    })
  })

  describe("updatePendingToolCalls", () => {
    it("handles mixed tool calls and results", () => {
      const pending = new Set<string>(["call-1"])
      const toolCalls: TypedToolCall<ToolSet>[] = [
        {
          type: "tool-call",
          toolCallId: "call-2",
          toolName: "tool_b",
          input: {},
          dynamic: true,
        },
      ]
      const toolResults: TypedToolResult<ToolSet>[] = [
        {
          type: "tool-result",
          toolCallId: "call-1",
          toolName: "tool_a",
          input: {},
          output: {},
        },
      ]

      updatePendingToolCalls(pending, toolCalls, toolResults)
      expect(pending.has("call-1")).toBe(false)
      expect(pending.has("call-2")).toBe(true)
    })
  })
})
